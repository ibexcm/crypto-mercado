import { Currency, Prisma } from "@ibexcm/database";

export class GuatemalaBankAccountRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async bank(id: string): Promise<Currency> {
    return await this.db.guatemalaBankAccount({ id }).bank();
  }
}
