import {
  Currency,
  ExchangeRate,
  Prisma,
  Transaction,
  TransactionFee,
  TransactionReceiptEvidenceUpdateManyInput,
} from "@ibexcm/database";
import {
  MutationSetTransactionReceiptEvidenceArgs,
  TransactionTax,
} from "@ibexcm/libraries/api";

export class TransactionReceiptRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async setTransactionReceiptEvidence({
    args,
  }: MutationSetTransactionReceiptEvidenceArgs): Promise<Transaction> {
    const { transactionID, bitcoin, fiat } = args;

    const transaction = await this.db.transaction({ id: transactionID });
    const transactionReceipt = await this.db.transaction({ id: transaction.id }).receipt();

    let evidence: TransactionReceiptEvidenceUpdateManyInput = {
      create: {
        transaction: {
          connect: {
            id: transaction.id,
          },
        },
      },
    };

    if (Boolean(bitcoin?.transactionHash)) {
      evidence.create = {
        ...evidence.create,
        bitcoinReceipt: {
          create: {
            transactionHash: bitcoin.transactionHash,
          },
        },
      };
    } else {
      evidence.create = {
        ...evidence.create,
        bankReceipt: {
          create: {
            fileHash: fiat.fileHash,
          },
        },
      };
    }

    await this.db.updateTransactionReceipt({
      where: { id: transactionReceipt.id },
      data: {
        evidence,
      },
    });

    return transaction;
  }

  async fromCurrency(id: string): Promise<Currency> {
    return await this.db.transactionReceipt({ id }).fromCurrency();
  }

  async toCurrency(id: string): Promise<Currency> {
    return await this.db.transactionReceipt({ id }).toCurrency();
  }

  async fee(id: string): Promise<TransactionFee> {
    return await this.db.transactionReceipt({ id }).fee();
  }

  async tax(id: string): Promise<TransactionTax> {
    return await this.db.transactionReceipt({ id }).tax();
  }

  async exchangeRate(id: string): Promise<ExchangeRate> {
    return await this.db.transactionReceipt({ id }).exchangeRate();
  }
}
