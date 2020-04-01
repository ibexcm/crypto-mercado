import { Currency, GuatemalaBankAccount, Prisma } from "@ibexcm/database";

export class BankAccountRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async currency(id: string): Promise<Currency> {
    return await this.db.bankAccount({ id }).currency();
  }

  async guatemala(id: string): Promise<GuatemalaBankAccount> {
    return await this.db.bankAccount({ id }).guatemala();
  }
}
