import { BankAccount, CryptoAccount, Prisma, User } from "@ibexcm/database";

export class RecipientRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async user(id: string): Promise<User> {
    return await this.db.recipient({ id }).user();
  }

  async bankAccount(id: string): Promise<BankAccount> {
    return await this.db.recipient({ id }).bankAccount();
  }

  async cryptoAccount(id: string): Promise<CryptoAccount> {
    return await this.db.recipient({ id }).cryptoAccount();
  }
}
