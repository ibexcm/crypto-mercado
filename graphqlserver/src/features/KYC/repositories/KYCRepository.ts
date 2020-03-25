import { Prisma, TGenre, User } from "@ibexcm/database";
import {
  MutationAdminKycApproveUserArgs,
  MutationAdminKycRejectUserArgs,
} from "@ibexcm/libraries/api";
import { IEmailNotificationsRepository } from "../../../features/EmailVerification/interfaces/IEmailNotificationsRepository";

export class KYCRepository {
  private db: Prisma;
  private emailNotificationsRepository: IEmailNotificationsRepository;

  constructor(db: Prisma, emailNotificationsRepository: IEmailNotificationsRepository) {
    this.db = db;
    this.emailNotificationsRepository = emailNotificationsRepository;
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

  async adminKYCApproveUser({
    userArgs: { id: userID },
    governmentIDArgs: {
      id: governmentID,
      firstName,
      lastName,
      CUI,
      expiresAt,
      genre,
      dateOfBirth,
    },
    bankAccountArgs: { id: bankAccountID },
  }: MutationAdminKycApproveUserArgs): Promise<Boolean> {
    // TODO we may require additional validation here to ensure the information in the gov. ID equals the bankAccount fullName

    await this.db.updateBankAccount({
      where: {
        id: bankAccountID,
      },
      data: {
        guatemala: {
          update: {
            verifiedAt: new Date(),
          },
        },
      },
    });

    await this.db.updateGuatemalaDPI({
      where: {
        id: governmentID,
      },
      data: {
        firstName,
        lastName,
        CUI,
        expiresAt: new Date(expiresAt),
        genre: genre as TGenre,
        dateOfBirth,
        verifiedAt: new Date(),
      },
    });

    const [{ address }] = await this.db
      .user({ id: userID })
      .contact()
      .email({ where: { verifiedAt_not: null }, orderBy: "createdAt_DESC", first: 1 });

    await this.emailNotificationsRepository.sendAdminKYCApproveUserNotification(address);

    return true;
  }

  async adminKYCRejectUser({
    userArgs: { id },
    rejectArgs: { reason },
  }: MutationAdminKycRejectUserArgs): Promise<Boolean> {
    return true;
  }
}
