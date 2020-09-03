import { Prisma, User } from "@ibexcm/database";
import {
  MutationResetPasswordArgs,
  MutationSendEmailAccountRecoveryArgs,
  MutationSendSmsAccountRecoveryArgs,
} from "@ibexcm/libraries/api";
import { genSalt, hash } from "bcryptjs";
import { IEmailAccountRecoveryRepository } from "../../../libraries/EmailVerification";
import { ISessionRepository } from "../../../libraries/Session";
import { ISMSAccountRecoveryRepository } from "../../../libraries/SMSVerification";

export class AccountRecoveryRepository {
  private db: Prisma;
  private sessionRepository: ISessionRepository;
  private emailAccountRecoveryRepository: IEmailAccountRecoveryRepository;
  private smsAccountRecoveryRepository: ISMSAccountRecoveryRepository;

  constructor(
    db: Prisma,
    sessionRepository: ISessionRepository,
    emailAccountRecoveryRepository: IEmailAccountRecoveryRepository,
    smsAccountRecoveryRepository: ISMSAccountRecoveryRepository,
  ) {
    this.db = db;
    this.sessionRepository = sessionRepository;
    this.emailAccountRecoveryRepository = emailAccountRecoveryRepository;
    this.smsAccountRecoveryRepository = smsAccountRecoveryRepository;
  }

  async sendEmailAccountRecovery({
    args: { address },
  }: MutationSendEmailAccountRecoveryArgs) {
    try {
      const _user = await this.db
        .email({ address })
        .contact()
        .user();

      const { token } = await this.sessionRepository.createAccountRecoverySession(_user);
      const emailSent = await this.emailAccountRecoveryRepository.sendRecoveryLink(
        address,
        {
          token,
        },
      );
      return {
        token,
        emailSent,
      };
    } catch (error) {}
  }

  async sendSMSAccountRecovery({ args: { number } }: MutationSendSmsAccountRecoveryArgs) {
    try {
      const _user = await this.db
        .phoneNumber({ number })
        .contact()
        .user();

      const { token } = await this.sessionRepository.createAccountRecoverySession(_user);
      const smsSent = await this.smsAccountRecoveryRepository.sendRecoveryLink(number, "", {
        token,
      });

      return {
        token,
        smsSent,
      };
    } catch (error) {}
  }

  async resetPassword({ args: { password } }: MutationResetPasswordArgs, user: User) {
    try {
      const _user = await this.db.updateUser({
        where: {
          id: user.id,
        },
        data: {
          account: {
            update: {
              password: await hash(password, await genSalt()),
            },
          },
        },
      });
      return await this.sessionRepository.createAuthenticationSession(_user);
    } catch (error) {}
  }
}
