import {
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
  User,
} from "@ibexcm/database";
import {
  BitcoinToFiatTransactionBreakdown,
  CreateTransactionUserInput,
  MutationCreateTransactionArgs,
  QueryGetTransactionBreakdownArgs,
  TransactionBreakdown,
} from "@ibexcm/libraries/api";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { config } from "../../../config";
import { IEmailNotificationsRepository } from "../../../libraries/EmailVerification/interfaces/IEmailNotificationsRepository";
import math from "../../../libraries/math";
import { IBitcoinRepository } from "../../Bitcoin/interfaces/IBitcoinRepository";
import { ExchangeRateRepository } from "../../ExchangeRate/repositories/ExchangeRateRepository";
import { TransactionFeeRepository } from "../../TransactionFee/repositories/TransactionFeeRepository";
import { TransactionTaxRepository } from "./TransactionTaxRepository";

const { adminAccountEmailAddress } = config.get("flags");

export class TransactionRepository {
  private db: Prisma;
  private emailNotificationsRepository: IEmailNotificationsRepository;
  private BitcoinRepository: IBitcoinRepository;
  private TransactionFeeRepository: TransactionFeeRepository;
  private TransactionTaxRepository: TransactionTaxRepository;
  private ExchangeRateRepository: ExchangeRateRepository;

  constructor(
    db: Prisma,
    emailNotificationsRepository: IEmailNotificationsRepository,
    BitcoinRepository: IBitcoinRepository,
    TransactionFeeRepository: TransactionFeeRepository,
    TransactionTaxRepository: TransactionTaxRepository,
    ExchangeRateRepository: ExchangeRateRepository,
  ) {
    this.db = db;
    this.emailNotificationsRepository = emailNotificationsRepository;
    this.BitcoinRepository = BitcoinRepository;
    this.TransactionFeeRepository = TransactionFeeRepository;
    this.TransactionTaxRepository = TransactionTaxRepository;
    this.ExchangeRateRepository = ExchangeRateRepository;
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
  }

  async createTransaction(
    args: MutationCreateTransactionArgs,
    senderUser: User,
  ): Promise<Transaction> {
    const [recipientUser] = await this.db.users({
      where: {
        role: {
          type: "ADMIN",
        },
        contact: {
          email_every: {
            address: adminAccountEmailAddress, // TODO put this address in .env
          },
        },
      },
      first: 1,
    });

    const sender = this.getOnCreateTransactionSender(senderUser, args);
    const recipient = await this.getOnCreateTransactionRecipient(recipientUser, args);
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

  private async getBitcoinToFiatTransactionBreakdown(
    args: QueryGetTransactionBreakdownArgs,
    senderUser: User,
  ): Promise<BitcoinToFiatTransactionBreakdown> {
    const {
      args: { amount: inputAmount, sender },
    } = args;

    const country = await this.db
      .bankAccount({ id: sender.bankAccountID })
      .guatemala()
      .bank()
      .country();

    const currency = await this.db.bankAccount({ id: sender.bankAccountID }).currency();

    const {
      symbol: currentPriceSymbol,
      price: currentPrice,
    } = await this.BitcoinRepository.getCurrentPriceByCurrencySymbol();

    const price = {
      key: "Precio actual BTC",
      value: `${currentPriceSymbol} ${currentPrice}`,
    };

    const amountByCurrentPrice = math.multiply(Number(currentPrice), Number(inputAmount));

    const amount = {
      key: "Cantidad",
      value: `${currentPriceSymbol} ${amountByCurrentPrice.toFixed(2).toString()}`,
    };

    const { fee: assignedFee } = await this.TransactionFeeRepository.calculate(senderUser);
    const calculatedFee = math.multiply(amountByCurrentPrice, Number(assignedFee));
    const fee = {
      key: `Comisión IBEX (${assignedFee}%)`,
      value: `${currentPriceSymbol} ${calculatedFee.toFixed(2).toString()}`,
    };

    const assignedTaxByCountry = this.TransactionTaxRepository.getTaxByCountry(country);
    const calculatedTax = math.multiply(calculatedFee, Number(assignedTaxByCountry));
    const tax = {
      key: `IVA (${assignedTaxByCountry}%)`,
      value: `${currentPriceSymbol} ${calculatedTax.toFixed(2).toString()}`,
    };

    const subtotal = math
      .chain(amountByCurrentPrice)
      .subtract(calculatedFee)
      .subtract(calculatedTax)
      .done();
    const total = {
      key: "Recibes",
      value: `${currentPriceSymbol} ${subtotal.toFixed(2).toString()}`,
    };

    let exchangeRate;
    if (currency.symbol !== CurrencySymbol.USD) {
      const {
        price: exchangeRatePrice,
      } = await this.ExchangeRateRepository.getLatestByCurrency(currency);
      const calculatedExchangeRate = math.multiply(subtotal, Number(exchangeRatePrice));
      exchangeRate = {
        key: `Tipo de cambio (${exchangeRatePrice})`,
        value: `${currency.symbol} ${calculatedExchangeRate.toFixed(2).toString()}`,
      };
    }

    return {
      __typename: "BitcoinToFiatTransactionBreakdown",
      price,
      amount,
      fee,
      tax,
      total,
      exchangeRate,
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

    const createCurrencies = {
      toCurrency: {
        connect: {
          id: toCurrency.id,
        },
      },
      fromCurrency: {
        connect: {
          symbol: CurrencySymbol.USD,
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

    const [{ id }] = await this.db.user({ id: recipientUser.id }).bankAccounts();
    return {
      bankAccount: {
        connect: {
          id,
        },
      },
    };
  }

  private async getOnCreateTransactionRecipient(
    recipientUser: User,
    args: MutationCreateTransactionArgs,
  ): Promise<RecipientCreateOneWithoutTransactionInput> {
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
}
