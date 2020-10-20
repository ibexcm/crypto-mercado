import { Prisma, TGuatemalaBankAccount, User } from "@ibexcm/database";
import {
  MutationSendEmailVerificationCodeArgs,
  MutationSetBankAccountArgs,
  MutationSetPasswordArgs,
  MutationUploadGovernmentIdArgs,
  MutationVerifyEmailArgs,
  Session,
} from "@ibexcm/libraries/api";
import { CountryPhoneNumberCode } from "@ibexcm/libraries/models/country";
import { genSalt, hash } from "bcryptjs";
import { config } from "../../../config";
import { ENVType } from "../../../config/models/ENVType";
import { IEmailVerificationRepository } from "../../../libraries/EmailVerification";
import { IEmailNotificationsRepository } from "../../../libraries/EmailVerification/interfaces/IEmailNotificationsRepository";
import { IFileManagementRepository } from "../../../libraries/FileManagement";
import { ISessionRepository } from "../../../libraries/Session/interfaces/ISessionRepository";
import { OnboardingError } from "../errors/OnboardingError";

export class OnboardingRepository {
  private db: Prisma;
  private sessionRepository: ISessionRepository;
  private emailVerificationRepository: IEmailVerificationRepository;
  private emailNotificationsRepository: IEmailNotificationsRepository;
  private fileManagementRepository: IFileManagementRepository;
  private verifiedEmails: string[];

  constructor(
    db: Prisma,
    sessionRepository: ISessionRepository,
    fileManagementRepository: IFileManagementRepository,
    emailVerificationRepository: IEmailVerificationRepository,
    emailNotificationsRepository: IEmailNotificationsRepository,
  ) {
    this.db = db;
    this.sessionRepository = sessionRepository;
    this.emailVerificationRepository = emailVerificationRepository;
    this.emailNotificationsRepository = emailNotificationsRepository;
    this.fileManagementRepository = fileManagementRepository;
    this.verifiedEmails =
      config.get("env") !== ENVType.production ? config.get("flags").verifiedEmails : [];
  }

  async sendEmailVerificationCode({
    args: { address },
  }: MutationSendEmailVerificationCodeArgs): Promise<Session> {
    const user = await this.db.createUser({
      role: {
        connect: {
          type: "CUSTOMER",
        },
      },
      contact: {
        create: {
          email: {
            create: {
              address,
            },
          },
        },
      },
      profile: {
        create: {
          country: {
            connect: {
              phoneNumberCode: CountryPhoneNumberCode.GTQ,
            },
          },
        },
      },
    });

    const { token, expiresAt } = await this.sessionRepository.createAuthenticationSession(
      user,
    );

    if (!this.verifiedEmails.includes(address)) {
      await this.emailVerificationRepository.sendVerificationCode(address, token);
    }

    return {
      token,
      expiresAt,
    };
  }

  async verifyEmail(
    { args: { address, code } }: MutationVerifyEmailArgs,
    user: User,
  ): Promise<Session> {
    const isVerified = this.verifiedEmails.includes(address)
      ? true
      : await this.emailVerificationRepository.verifyCode(address, code);

    if (!isVerified) throw OnboardingError.verificationCodeError;

    const _user = await this.db.updateUser({
      where: {
        id: user.id,
      },
      data: {
        contact: {
          update: {
            email: {
              update: {
                where: {
                  address,
                },
                data: {
                  verifiedAt: new Date(),
                },
              },
            },
          },
        },
      },
    });

    return await this.sessionRepository.createAuthenticationSession(_user);
  }

  async setPassword(
    { args: { password } }: MutationSetPasswordArgs,
    user: User,
  ): Promise<Session> {
    const getClientID = () => {
      const alpha = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 2)
        .toUpperCase();
      const numeric = new Date()
        .getTime()
        .toString()
        .substr(6, 6);
      return `${alpha}${numeric}`;
    };

    const _user = await this.db.updateUser({
      where: {
        id: user.id,
      },
      data: {
        account: {
          create: {
            clientID: getClientID(),
            password: await hash(password, await genSalt()),
          },
        },
      },
    });

    return await this.sessionRepository.createAuthenticationSession(_user);
  }

  async uploadGovernmentID(
    { args: { fileHash } }: MutationUploadGovernmentIdArgs,
    user: User,
  ): Promise<Session> {
    const _user = await this.db.updateUser({
      where: {
        id: user.id,
      },
      data: {
        profile: {
          update: {
            documents: {
              create: {
                guatemala: {
                  create: {
                    dpi: {
                      create: {
                        fileHash,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return await this.sessionRepository.createAuthenticationSession(_user);
  }

  async setBankAccount(
    {
      args: { fullName, accountNumber, bankID, currencyID, bankAccountType },
    }: MutationSetBankAccountArgs,
    user: User,
  ): Promise<Session> {
    const country = await this.db.bank({ id: bankID }).country();

    const _user = await this.db.updateUser({
      where: {
        id: user.id,
      },
      data: {
        bankAccounts: {
          create: {
            currency: {
              connect: {
                id: currencyID,
              },
            },
            country: {
              connect: {
                id: country.id,
              },
            },
            guatemala: {
              create: {
                fullName,
                accountNumber,
                bankAccountType: bankAccountType as TGuatemalaBankAccount,
                bank: {
                  connect: {
                    id: bankID,
                  },
                },
              },
            },
          },
        },
      },
    });

    try {
      const [clientID] = await Promise.all<string>([
        this.db
          .user({ id: _user.id })
          .account()
          .clientID(),
      ]);

      this.emailNotificationsRepository.sendAdminCustomerOnboardingCompleteNotification({
        clientID,
      });
    } catch (error) {}

    return await this.sessionRepository.createAuthenticationSession(_user);
  }
}
