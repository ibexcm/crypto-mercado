import { Prisma, TransactionFee, User } from "@ibexcm/database";

export class TransactionFeeRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async calculate(user: User): Promise<Pick<TransactionFee, "fee">> {
    return { fee: (3.5 / 100).toString() };
  }
}
