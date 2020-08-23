import {
  Currency,
  ExchangeRate,
  Price,
  Prisma,
  Transaction,
  TransactionFee,
  TransactionReceiptEvidenceUpdateManyInput,
  TransactionTax,
} from "@ibexcm/database";
import { MutationSetTransactionReceiptEvidenceArgs } from "@ibexcm/libraries/api";

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

  async evidence(id: string): Promise<ExchangeRate> {
    return await this.db.transactionReceipt({ id }).evidence();
  }

  async bankReceipt(id: string): Promise<ExchangeRate> {
    return await this.db.transactionReceiptEvidence({ id }).bankReceipt();
  }

  async bitcoinReceipt(id: string): Promise<ExchangeRate> {
    return await this.db.transactionReceiptEvidence({ id }).bitcoinReceipt();
  }

  async price(id: string): Promise<Price> {
    return await this.db.bitcoinReceiptEvidence({ id }).price();
  }

  async currency(id: string): Promise<Price> {
    return await this.db.price({ id }).currency();
  }
}
