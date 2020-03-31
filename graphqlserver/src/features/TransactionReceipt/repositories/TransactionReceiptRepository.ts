import { Currency, Prisma } from "@ibexcm/database";

export class TransactionReceiptRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async fromCurrency(id: string): Promise<Currency> {
    return await this.db.transactionReceipt({ id }).fromCurrency();
  }

  async toCurrency(id: string): Promise<Currency> {
    return await this.db.transactionReceipt({ id }).toCurrency();
  }
}
