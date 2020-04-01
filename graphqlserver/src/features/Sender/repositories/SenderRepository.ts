import { BankAccount, CryptoAccount, Prisma, User } from "@ibexcm/database";

export class SenderRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async user(id: string): Promise<User> {
    return await this.db.sender({ id }).user();
  }

  async bankAccount(id: string): Promise<BankAccount> {
    return await this.db.sender({ id }).bankAccount();
  }
  
  async cryptoAccount(id: string): Promise<CryptoAccount> {
    return await this.db.sender({ id }).cryptoAccount();
  }
}
