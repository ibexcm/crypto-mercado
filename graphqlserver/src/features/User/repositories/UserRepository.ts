import { Prisma, TGuatemalaBankAccount, User, UserRoleType } from "@ibexcm/database";
import {
  MutationSendEmailVerificationCodeArgs,
  MutationSendPhoneNumberVerificationCodeArgs,
  MutationSetBankAccountArgs,
  MutationSetPasswordArgs,
  MutationUploadGovernmentIdArgs,
  MutationVerifyEmailArgs,
  MutationVerifyPhoneNumberArgs,
  Session,
} from "@ibexcm/libraries/api";
import { CountryPhoneNumberCode } from "@ibexcm/libraries/models/country";
import { genSalt, hash } from "bcryptjs";
import { config } from "../../../config";
import { ENVType } from "../../../config/models/ENVType";
import { IEmailVerificationRepository } from "../../EmailVerification";
import { IFileManagementRepository } from "../../FileManagement";
import { ISessionRepository } from "../../Session/interfaces/ISessionRepository";
import { ISMSVerificationRepository } from "../../SMSVerification";
import { UserError } from "../errors/UserError";

export class UserRepository {
  private db: Prisma;
  private sessionRepository: ISessionRepository;
  private smsVerificationRepository: ISMSVerificationRepository;
  private emailVerificationRepository: IEmailVerificationRepository;
  private fileManagementRepository: IFileManagementRepository;
  private verifiedPhoneNumbers: string[];
  private verifiedEmails: string[];

  constructor(
    db: Prisma,
    sessionRepository: ISessionRepository,
    smsVerificationRepository: ISMSVerificationRepository,
    fileManagementRepository: IFileManagementRepository,
    emailVerificationRepository: IEmailVerificationRepository,
  ) {
    this.db = db;
    this.sessionRepository = sessionRepository;
    this.smsVerificationRepository = smsVerificationRepository;
    this.emailVerificationRepository = emailVerificationRepository;
    this.fileManagementRepository = fileManagementRepository;
    this.verifiedPhoneNumbers =
      config.get("env") !== ENVType.production
        ? config.get("flags").verifiedPhoneNumbers
        : [];
    this.verifiedEmails =
      config.get("env") !== ENVType.production ? config.get("flags").verifiedEmails : [];
  }

  async sendPhoneNumberVerificationCode({
    args: { number },
  }: MutationSendPhoneNumberVerificationCodeArgs): Promise<boolean> {
    if (this.verifiedPhoneNumbers.includes(number)) {
      return true;
    }

    return await this.smsVerificationRepository.sendVerificationCode(number);
  }

  async sendEmailVerificationCode({
    args: { address },
  }: MutationSendEmailVerificationCodeArgs): Promise<boolean> {
    if (this.verifiedEmails.includes(address)) {
      return true;
    }

    return await this.emailVerificationRepository.sendVerificationCode(address);
  }

  async verifyPhoneNumber({
    args: { number, code },
  }: MutationVerifyPhoneNumberArgs): Promise<Session> {
    const isVerified = this.verifiedPhoneNumbers.includes(number)
      ? true
      : await this.smsVerificationRepository.verifyCode(number, code);

    if (!isVerified) throw UserError.verificationCodeError;

    const user = await this.db.createUser({
      role: {
        connect: {
          type: UserRoleType.ADMIN,
        },
      },
      contact: {
        create: {
          phoneNumber: {
            create: {
              number,
              verifiedAt: new Date(),
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

    return await this.sessionRepository.createAuthenticationSession(user);
  }

  async verifyEmail(
    { args: { address, code } }: MutationVerifyEmailArgs,
    user: User,
  ): Promise<Session> {
    const isVerified = this.verifiedEmails.includes(address)
      ? true
      : await this.emailVerificationRepository.verifyCode(address, code);

    if (!isVerified) throw UserError.verificationCodeError;

    const _user = await this.db.updateUser({
      where: {
        id: user.id,
      },
      data: {
        contact: {
          update: {
            email: {
              create: {
                address,
                verifiedAt: new Date(),
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

    return await this.sessionRepository.createAuthenticationSession(_user);
  }
}
