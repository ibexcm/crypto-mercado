import { BankAccount, Currency, GuatemalaBankAccount, Prisma } from "@ibexcm/database";
import { UserRepository } from "../../User/repositories/UserRepository";

export class BankAccountRepository {
  private db: Prisma;
  private UserRepository: UserRepository;

  constructor(db: Prisma, UserRepository: UserRepository) {
    this.db = db;
    this.UserRepository = UserRepository;
  }

  async getAdminBankAccounts(): Promise<BankAccount[]> {
    const { id } = await this.UserRepository.getDefaultAdminUser();

    return await this.db.user({ id }).bankAccounts();
  }

  async currency(id: string): Promise<Currency> {
    return await this.db.bankAccount({ id }).currency();
  }

  async guatemala(id: string): Promise<GuatemalaBankAccount> {
    return await this.db.bankAccount({ id }).guatemala();
  }
}
