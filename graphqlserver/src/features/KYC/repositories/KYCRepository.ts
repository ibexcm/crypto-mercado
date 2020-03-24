import { Prisma, User } from "@ibexcm/database";

export class KYCRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async adminGetUsersWithPendingKYCApproval(): Promise<User[]> {
    return await this.db.users({
      where: {
        role: {
          type_not: "ADMIN",
        },
        bankAccounts_every: {
          guatemala: {
            accountNumber_not: null,
            fullName_not: null,
            bankAccountType_not: null,
            bank: {
              id_not: null,
            },
          },
        },
        profile: {
          documents: {
            guatemala: {
              dpi_every: {
                id_not: null,
              },
            },
          },
        },
      },
    });
  }
}
