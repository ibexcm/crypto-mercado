import { Prisma, UserRoleType } from "@ibexcm/database";
import {
  MutationSendVerificationCodeArgs,
  MutationVerifyPhoneNumberArgs,
  Session,
} from "@ibexcm/libraries/api";
import { config } from "../../../config";
import { ENVType } from "../../../config/models/ENVType";
import { IFileManagementRepository } from "../../FileManagement";
import { ISessionRepository } from "../../Session/interfaces/ISessionRepository";
import { ISMSVerificationRepository } from "../../SMSVerification";
import { UserError } from "../errors/UserError";

export class UserRepository {
  private db: Prisma;
  private sessionRepository: ISessionRepository;
  private smsVerificationRepository: ISMSVerificationRepository;
  private fileManagementRepository: IFileManagementRepository;
  private verifiedPhoneNumbers: string[];

  constructor(
    db: Prisma,
    sessionRepository: ISessionRepository,
    smsVerificationRepository: ISMSVerificationRepository,
    fileManagementRepository: IFileManagementRepository,
  ) {
    this.db = db;
    this.sessionRepository = sessionRepository;
    this.smsVerificationRepository = smsVerificationRepository;
    this.fileManagementRepository = fileManagementRepository;
    this.verifiedPhoneNumbers =
      config.get("env") !== ENVType.production
        ? config.get("flags").verifiedPhoneNumbers
        : [];
  }

  async sendVerificationCode({
    args: { number },
  }: MutationSendVerificationCodeArgs): Promise<boolean> {
    if (this.verifiedPhoneNumbers.includes(number)) {
      return true;
    }

    return await this.smsVerificationRepository.sendVerificationCode(number);
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
}
