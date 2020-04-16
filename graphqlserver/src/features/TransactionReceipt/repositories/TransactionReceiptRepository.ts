import { Currency, ExchangeRate, Prisma, TransactionFee } from "@ibexcm/database";
import { TransactionTax } from "@ibexcm/libraries/api";

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
