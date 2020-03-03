import { Prisma, User, UserRoleType } from "@ibexcm/database";
import {
  MutationSendEmailVerificationCodeArgs,
  MutationSendPhoneNumberVerificationCodeArgs,
  MutationVerifyEmailArgs,
  MutationVerifyPhoneNumberArgs,
  Session,
} from "@ibexcm/libraries/api";
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
            },
          },
        },
      },
    });

    const session = await this.sessionRepository.createAuthenticationSession(user);

    return session;
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
          create: {
            email: {
              create: {
                address,
              },
            },
          },
        },
      },
    });

    const session = await this.sessionRepository.createAuthenticationSession(_user);

    return session;
  }
}
