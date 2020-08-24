import {
  Currency,
  Email,
  Prisma,
  RecipientCreateOneWithoutTransactionInput,
  RecipientCreateWithoutTransactionInput,
  Sender,
  SenderCreateOneWithoutTransactionInput,
  Transaction,
  TransactionFeeCreateOneInput,
  TransactionReceiptCreateOneWithoutTransactionInput,
  TransactionReceiptCreateWithoutTransactionInput,
  TransactionTaxCreateOneInput,
  TransactionUpdateInput,
  User,
} from "@ibexcm/database";
import {
  BitcoinToFiatTransactionBreakdown,
  CreateTransactionUserInput,
  FiatToBitcoinTransactionBreakdown,
  MutationAdminUpdateTransactionArgs,
  MutationCreateTransactionArgs,
  QueryAdminGetTransactionsArgs,
  QueryGetTransactionArgs,
  QueryGetTransactionBreakdownArgs,
  TransactionBreakdown,
  TransactionBreakdownField,
} from "@ibexcm/libraries/api";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { IEmailNotificationsRepository } from "../../../libraries/EmailVerification/interfaces/IEmailNotificationsRepository";
import math from "../../../libraries/math";
import {
  IBitcoinPriceResponse,
  IBitcoinRepository,
} from "../../Bitcoin/interfaces/IBitcoinRepository";
import { ExchangeRateRepository } from "../../ExchangeRate/repositories/ExchangeRateRepository";
import { TransactionFeeRepository } from "../../TransactionFee/repositories/TransactionFeeRepository";
import { UserRepository } from "../../User/repositories/UserRepository";
import { TransactionError } from "../errors/TransactionError";
import { TransactionTaxRepository } from "./TransactionTaxRepository";

const fiatFormatter = Intl.NumberFormat();
const btcFormatter = Intl.NumberFormat("en-US", {
  minimumFractionDigits: 5,
});

export class TransactionRepository {
  private db: Prisma;
  private emailNotificationsRepository: IEmailNotificationsRepository;
  private BitcoinRepository: IBitcoinRepository;
  private TransactionFeeRepository: TransactionFeeRepository;
  private UserRepository: UserRepository;
  private TransactionTaxRepository: TransactionTaxRepository;
  private ExchangeRateRepository: ExchangeRateRepository;

  constructor(
    db: Prisma,
    emailNotificationsRepository: IEmailNotificationsRepository,
    BitcoinRepository: IBitcoinRepository,
    TransactionFeeRepository: TransactionFeeRepository,
    TransactionTaxRepository: TransactionTaxRepository,
    ExchangeRateRepository: ExchangeRateRepository,
    UserRepository: UserRepository,
  ) {
    this.db = db;
    this.emailNotificationsRepository = emailNotificationsRepository;
    this.BitcoinRepository = BitcoinRepository;
    this.TransactionFeeRepository = TransactionFeeRepository;
    this.TransactionTaxRepository = TransactionTaxRepository;
    this.ExchangeRateRepository = ExchangeRateRepository;
    this.UserRepository = UserRepository;
  }

  async adminGetTransactions({
    args,
  }: QueryAdminGetTransactionsArgs): Promise<Transaction[]> {
    return await this.db.transactions(args);
  }

  async getTransaction({
    args: { transactionID },
  }: QueryGetTransactionArgs): Promise<Transaction> {
    const transactionExists = await this.db.$exists.transaction({ id: transactionID });
    if (!transactionExists) {
      throw TransactionError.transactionDoesNotExist;
    }

    return await this.db.transaction({ id: transactionID });
  }

  async getTransactionBreakdown(
    args: QueryGetTransactionBreakdownArgs,
    senderUser: User,
  ): Promise<TransactionBreakdown> {
    const {
      args: { amount, sender },
    } = args;

    if (Boolean(sender.bankAccountID)) {
      return this.getBitcoinToFiatTransactionBreakdown(args, senderUser);
    }

    return this.getFiatToBitcoinTransactionBreakdown(args, senderUser);
  }

  async adminUpdateTransaction(
    { args }: MutationAdminUpdateTransactionArgs,
    senderUser: User,
  ): Promise<Transaction> {
    const transactionID = args.id;
    const data: TransactionUpdateInput = {
      receipt: {
        update: {},
      },
    };

    if (Boolean(args?.amount)) {
      data.amount = args.amount;
    }

    if (Boolean(args?.receipt?.exchangeRate?.price)) {
      data.receipt.update.exchangeRate = {
        create: {
          price: args.receipt.exchangeRate.price,
          currency: {
            connect: {
              symbol: CurrencySymbol.USD,
            },
          },
        },
      };
    }

    if (Boolean(args?.receipt?.fee?.value)) {
      data.receipt.update.fee = {
        create: {
          fee: args.receipt.fee.value,
        },
      };
    }

    if (Boolean(args?.receipt?.tax?.value)) {
      data.receipt.update.tax = {
        create: {
          tax: args.receipt.tax.value,
        },
      };
    }

    if (
      Boolean(args?.receipt?.cryptoEvidence?.id) &&
      Boolean(args?.receipt?.cryptoEvidence?.price?.value)
    ) {
      await this.db.updateBitcoinReceiptEvidence({
        where: { id: args.receipt.cryptoEvidence.id },
        data: {
          price: {
            create: {
              value: args.receipt.cryptoEvidence.price.value,
              currency: {
                connect: {
                  symbol: CurrencySymbol.USD,
                },
              },
            },
          },
        },
      });
    }

    return await this.db.updateTransaction({ where: { id: transactionID }, data });
  }

  async createTransaction(
    args: MutationCreateTransactionArgs,
    senderUser: User,
  ): Promise<Transaction> {
    const sender = this.getOnCreateTransactionSender(senderUser, args);
    const recipient = await this.getOnCreateTransactionRecipient(args);
    const receipt = await this.getTransactionReceipt(senderUser, args);

    const { args: input } = args;

    const amount = input?.amount || "0.00";

    const transaction = await this.db.createTransaction({
      amount,
      receipt,
      recipient,
      sender,
    });

    await this.db.updateUser({
      where: {
        id: senderUser.id,
      },
      data: {
        transactions: {
          connect: {
            id: transaction.id,
          },
        },
      },
    });

    const [email, fromCurrency, toCurrency] = await Promise.all<
      Array<Email>,
      Currency,
      Currency
    >([
      this.db
        .transaction({ id: transaction.id })
        .sender()
        .user()
        .contact()
        .email({ where: { verifiedAt_not: null } }),
      this.db
        .transaction({ id: transaction.id })
        .receipt()
        .fromCurrency(),
      this.db
        .transaction({ id: transaction.id })
        .receipt()
        .toCurrency(),
    ]);

    const [{ address }] = email;

    this.emailNotificationsRepository.sendTransactionSuccessNotification(address, {
      transaction,
      fromCurrencySymbol: fromCurrency.symbol,
      toCurrencySymbol: toCurrency.symbol,
    });

    return transaction;
  }

  async sender(id: string): Promise<Sender> {
    return await this.db.transaction({ id }).sender();
  }

  async recipient(id: string): Promise<Sender> {
    return await this.db.transaction({ id }).recipient();
  }

  async receipt(id: string): Promise<Sender> {
    return await this.db.transaction({ id }).receipt();
  }

  private async getFiatToBitcoinTransactionBreakdown(
    { args }: QueryGetTransactionBreakdownArgs,
    senderUser: User,
  ): Promise<FiatToBitcoinTransactionBreakdown> {
    const { amount: inputAmount, sender, recipient } = args;

    const transactionID = args?.transactionID;

    const baseCurrency = await this.db.currency({ symbol: CurrencySymbol.USD });
    const destinationCurrency = await this.db
      .bankAccount({ id: recipient.bankAccountID })
      .currency();

    const { priceAtBaseCurrency, priceField } = await this.getPriceAtBaseCurrency(
      baseCurrency,
      transactionID,
    );

    const priceAtDestinationCurrency = await this.BitcoinRepository.getCurrentPriceByCurrency(
      destinationCurrency,
    );

    const amountByCurrentPrice = math.divide(
      Number(inputAmount),
      Number(priceAtDestinationCurrency.price),
    );

    const amount = {
      key: "Cantidad",
      value: `${CurrencySymbol.BTC} ${btcFormatter.format(amountByCurrentPrice)}`,
    };

    const assignedFee = await this.getAssignedFee(senderUser, transactionID);
    const calculatedFee = math.multiply(amountByCurrentPrice, Number(assignedFee));

    const country = await this.db
      .user({ id: senderUser.id })
      .profile()
      .country();
    const assignedTaxByCountry = this.TransactionTaxRepository.getTaxByCountry(country);
    const calculatedTax = math.multiply(calculatedFee, Number(assignedTaxByCountry));
    const feePlusTax = math.add(calculatedFee, calculatedTax);

    const fee = {
      key: `Comisión IBEX (${math.multiply(Number(assignedFee), 100).toFixed(1)}%)`,
      value: `${CurrencySymbol.BTC} ${btcFormatter.format(Number(feePlusTax))}`,
    };

    const subtotal = math
      .chain(amountByCurrentPrice)
      .subtract(calculatedFee)
      .subtract(calculatedTax)
      .done();

    const total = {
      key: "Total",
      value: `${CurrencySymbol.BTC} ${btcFormatter.format(subtotal)}`,
    };

    const { priceAtRateField: priceAtRate } = await this.getPriceAtRate(
      priceAtBaseCurrency,
      priceAtDestinationCurrency,
      destinationCurrency,
      transactionID,
    );

    return {
      __typename: "FiatToBitcoinTransactionBreakdown",
      price: priceField,
      amount,
      fee,
      total,
      priceAtRate,
    };
  }

  private async getBitcoinToFiatTransactionBreakdown(
    { args }: QueryGetTransactionBreakdownArgs,
    senderUser: User,
  ): Promise<BitcoinToFiatTransactionBreakdown> {
    const { amount: inputAmount, sender } = args;

    const transactionID = args?.transactionID;

    const baseCurrency = await this.db.currency({ symbol: CurrencySymbol.USD });
    const destinationCurrency = await this.db
      .bankAccount({ id: sender.bankAccountID })
      .currency();

    const { priceAtBaseCurrency, priceField } = await this.getPriceAtBaseCurrency(
      baseCurrency,
      transactionID,
    );

    const priceAtDestinationCurrency = await this.BitcoinRepository.getCurrentPriceByCurrency(
      destinationCurrency,
    );

    const amountByCurrentPrice = math.multiply(
      Number(priceAtDestinationCurrency.price),
      Number(inputAmount),
    );

    const amount = {
      key: "Cantidad",
      value: `${priceAtDestinationCurrency.symbol} ${fiatFormatter.format(
        amountByCurrentPrice,
      )}`,
    };

    const assignedFee = await this.getAssignedFee(senderUser, transactionID);
    const calculatedFee = math.multiply(amountByCurrentPrice, Number(assignedFee));

    const country = await this.db
      .user({ id: senderUser.id })
      .profile()
      .country();
    const assignedTaxByCountry = this.TransactionTaxRepository.getTaxByCountry(country);
    const calculatedTax = math.multiply(calculatedFee, Number(assignedTaxByCountry));
    const feePlusTax = math.add(calculatedFee, calculatedTax);

    const fee = {
      key: `Comisión IBEX (${math.multiply(Number(assignedFee), 100).toFixed(1)}%)`,
      value: `${priceAtDestinationCurrency.symbol} ${fiatFormatter.format(
        Number(feePlusTax),
      )}`,
    };

    const subtotal = math
      .chain(amountByCurrentPrice)
      .subtract(calculatedFee)
      .subtract(calculatedTax)
      .done();

    const total = {
      key: "Recibes",
      value: `${priceAtDestinationCurrency.symbol} ${fiatFormatter.format(subtotal)}`,
    };

    const { priceAtRateField: priceAtRate } = await this.getPriceAtRate(
      priceAtBaseCurrency,
      priceAtDestinationCurrency,
      destinationCurrency,
      transactionID,
    );

    return {
      __typename: "BitcoinToFiatTransactionBreakdown",
      price: priceField,
      amount,
      fee,
      total,
      priceAtRate,
    };
  }

  private async getTaxByCurrency({
    bankAccountID,
    cryptoAccountID,
  }: CreateTransactionUserInput): Promise<string> {
    const currency = Boolean(bankAccountID)
      ? await this.db.bankAccount({ id: bankAccountID }).currency()
      : await this.db.cryptoAccount({ id: cryptoAccountID }).currency();
    return this.TransactionTaxRepository.getTaxByCurrency(currency);
  }

  private async getTransactionReceipt(
    senderUser: User,
    args: MutationCreateTransactionArgs,
  ): Promise<TransactionReceiptCreateOneWithoutTransactionInput> {
    const {
      args: { sender, recipient },
    } = args;

    const { fee } = await this.TransactionFeeRepository.calculate(senderUser);

    const tax = await this.getTaxByCurrency(sender);

    const createFee = {
      fee: {
        create: {
          fee,
        },
      } as TransactionFeeCreateOneInput,
    };

    const createTax = {
      tax: {
        create: {
          tax,
        },
      } as TransactionTaxCreateOneInput,
    };

    if (Boolean(sender.bankAccountID)) {
      const toCurrency = await this.db.bankAccount({ id: sender.bankAccountID }).currency();

      const createCurrencies = {
        toCurrency: {
          connect: {
            id: toCurrency.id,
          },
        },
        fromCurrency: {
          connect: {
            symbol: CurrencySymbol.BTC,
          },
        },
      };

      const create = {
        ...createFee,
        ...createTax,
        ...createCurrencies,
      } as TransactionReceiptCreateWithoutTransactionInput;

      if (toCurrency.symbol !== CurrencySymbol.USD) {
        const [{ id: exchangeRateID }] = await this.db.exchangeRates({
          where: { currency: { symbol: toCurrency.symbol } },
          orderBy: "createdAt_DESC",
          first: 1,
        });

        create.exchangeRate = {
          connect: {
            id: exchangeRateID,
          },
        };
      }

      return { create };
    }

    const toCurrency = await this.db
      .cryptoAccount({ id: sender.cryptoAccountID })
      .currency();

    const fromCurrency = await this.db
      .bankAccount({ id: recipient.bankAccountID })
      .currency();

    const createCurrencies = {
      toCurrency: {
        connect: {
          id: toCurrency.id,
        },
      },
      fromCurrency: {
        connect: {
          id: fromCurrency.id,
        },
      },
    };

    return {
      create: {
        ...createFee,
        ...createTax,
        ...createCurrencies,
      },
    };
  }

  private async getRecipientTargetAccount(
    recipientUser: User,
    { args: { sender, recipient } }: MutationCreateTransactionArgs,
  ): Promise<
    | Pick<RecipientCreateWithoutTransactionInput, "bankAccount">
    | Pick<RecipientCreateWithoutTransactionInput, "cryptoAccount">
  > {
    if (Boolean(sender.bankAccountID)) {
      const [{ id }] = await this.db.user({ id: recipientUser.id }).cryptoAccounts();
      return {
        cryptoAccount: {
          connect: {
            id,
          },
        },
      };
    }

    return {
      bankAccount: {
        connect: {
          id: recipient.bankAccountID,
        },
      },
    };
  }

  private async getOnCreateTransactionRecipient(
    args: MutationCreateTransactionArgs,
  ): Promise<RecipientCreateOneWithoutTransactionInput> {
    const recipientUser = await this.UserRepository.getDefaultAdminUser();

    const recipient: RecipientCreateOneWithoutTransactionInput = {
      create: {
        user: {
          connect: {
            id: recipientUser.id,
          },
        },
      },
    };

    const targetAccount = await this.getRecipientTargetAccount(recipientUser, args);

    recipient.create = {
      ...recipient.create,
      ...targetAccount,
    };

    return recipient;
  }

  private getOnCreateTransactionSender(
    senderUser: User,
    { args: { sender: transactionSender } }: MutationCreateTransactionArgs,
  ): SenderCreateOneWithoutTransactionInput {
    const sender: SenderCreateOneWithoutTransactionInput = {
      create: {
        user: {
          connect: {
            id: senderUser.id,
          },
        },
      },
    };

    if (Boolean(transactionSender.bankAccountID)) {
      return {
        create: {
          user: {
            ...sender.create.user,
          },
          bankAccount: {
            connect: {
              id: transactionSender.bankAccountID,
            },
          },
        },
      };
    }

    return {
      create: {
        user: {
          ...sender.create.user,
        },
        cryptoAccount: {
          connect: {
            id: transactionSender.cryptoAccountID,
          },
        },
      },
    };
  }

  private async getPriceAtBaseCurrency(
    baseCurrency: Currency,
    transactionID: string,
  ): Promise<{
    priceAtBaseCurrency: IBitcoinPriceResponse;
    priceField: TransactionBreakdownField;
  }> {
    let priceAtBaseCurrency: IBitcoinPriceResponse = await this.BitcoinRepository.getCurrentPriceByCurrency(
      baseCurrency,
    );

    const priceField: TransactionBreakdownField = {
      key: "Precio BTC Actual",
      value: "",
    };

    if (Boolean(transactionID)) {
      const evidence = await this.db
        .transaction({ id: transactionID })
        .receipt()
        .evidence();

      if (evidence.length > 0) {
        const cryptoPrices = (
          await Promise.all(
            evidence.map(e =>
              this.db
                .transactionReceiptEvidence({ id: e.id })
                .bitcoinReceipt()
                .price(),
            ),
          )
        ).filter(Boolean);

        if (cryptoPrices.length > 0) {
          priceAtBaseCurrency = {
            price: cryptoPrices[cryptoPrices.length - 1].value,
            symbol: CurrencySymbol.USD,
          };

          priceField.key = `Precio BTC Obtenido`;
        }
      }
    }

    priceField.value = `${priceAtBaseCurrency.symbol} ${fiatFormatter.format(
      Number(priceAtBaseCurrency.price),
    )}`;

    return {
      priceAtBaseCurrency,
      priceField,
    };
  }

  private async getAssignedFee(user: User, transactionID: string): Promise<string> {
    let assignedFee: string = (await this.TransactionFeeRepository.calculate(user)).fee;

    if (Boolean(transactionID)) {
      const transactionFee = await this.db
        .transaction({ id: transactionID })
        .receipt()
        .fee();

      if (Boolean(transactionFee)) {
        assignedFee = transactionFee.fee;
      }
    }

    return assignedFee;
  }

  private async getPriceAtRate(
    priceAtBaseCurrency: IBitcoinPriceResponse,
    priceAtDestinationCurrency: IBitcoinPriceResponse,
    destinationCurrency: Currency,
    transactionID: string,
  ): Promise<{
    priceAtRateField: TransactionBreakdownField;
  }> {
    let priceAtRateField;

    if (priceAtDestinationCurrency.symbol !== CurrencySymbol.USD) {
      let exchangeRatePrice = (
        await this.ExchangeRateRepository.getLatestByCurrency(destinationCurrency)
      ).price;

      if (Boolean(transactionID)) {
        const price = await this.db
          .transaction({ id: transactionID })
          .receipt()
          .exchangeRate();

        if (Boolean(price)) {
          exchangeRatePrice = price.price;
        }
      }

      priceAtRateField = {
        key: `Tipo de Cambio (${exchangeRatePrice} ${priceAtDestinationCurrency.symbol}/${priceAtBaseCurrency.symbol})`,
        value: `${priceAtDestinationCurrency.symbol} ${fiatFormatter.format(
          Number(priceAtDestinationCurrency.price),
        )}`,
      };
    }

    return {
      priceAtRateField,
    };
  }
}
