import { Currency, Prisma } from "@ibexcm/database";

export class CryptoAccountRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async currency(id: string): Promise<Currency> {
    return await this.db.cryptoAccount({ id }).currency();
  }
}
