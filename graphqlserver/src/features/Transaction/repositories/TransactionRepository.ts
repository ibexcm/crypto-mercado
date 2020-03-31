import {
  Prisma,
  RecipientCreateOneWithoutTransactionInput,
  RecipientCreateWithoutTransactionInput,
  Sender,
  SenderCreateOneWithoutTransactionInput,
  Transaction,
  TransactionReceiptCreateOneWithoutTransactionInput,
  User,
} from "@ibexcm/database";
import { MutationCreateTransactionArgs } from "@ibexcm/libraries/api";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { config } from "../../../config";
import { IEmailNotificationsRepository } from "../../../libraries/EmailVerification/interfaces/IEmailNotificationsRepository";

const { adminAccountEmailAddress } = config.get("flags");

export class TransactionRepository {
  private db: Prisma;
  private emailNotificationsRepository: IEmailNotificationsRepository;

  constructor(db: Prisma, emailNotificationsRepository: IEmailNotificationsRepository) {
    this.db = db;
    this.emailNotificationsRepository = emailNotificationsRepository;
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
    const receipt = await this.getTransactionReceipt(args);

    const { args: input } = args;

    const amount = input?.amount || "0.00";

    return await this.db.createTransaction({
      amount,
      receipt,
      recipient,
      sender,
    });
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

  private async getTransactionReceipt({
    args: { bankAccountID, cryptoAccountID },
  }: MutationCreateTransactionArgs): Promise<
    TransactionReceiptCreateOneWithoutTransactionInput
  > {
    if (Boolean(bankAccountID)) {
      const toCurrency = await this.db.bankAccount({ id: bankAccountID }).currency();
      return {
        create: {
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
        },
      };
    }

    const toCurrency = await this.db.cryptoAccount({ id: cryptoAccountID }).currency();
    return {
      create: {
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
      },
    };
  }

  private async getRecipientTargetAccount(
    recipientUser: User,
    { args: { bankAccountID } }: MutationCreateTransactionArgs,
  ): Promise<
    | Pick<RecipientCreateWithoutTransactionInput, "bankAccount">
    | Pick<RecipientCreateWithoutTransactionInput, "cryptoAccount">
  > {
    if (Boolean(bankAccountID)) {
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
    { args: { bankAccountID, cryptoAccountID } }: MutationCreateTransactionArgs,
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

    if (Boolean(bankAccountID)) {
      return {
        create: {
          user: {
            ...sender.create.user,
          },
          bankAccount: {
            connect: {
              id: bankAccountID,
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
            id: cryptoAccountID,
          },
        },
      },
    };
  }
}
