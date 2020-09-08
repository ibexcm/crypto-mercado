import { Prisma, User } from "@ibexcm/database";
import {
  MutationResetPasswordArgs,
  QueryRecoverAccountArgs,
  Session,
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

  private async sendEmailAccountRecoveryLink(address: string) {
    const user = await this.db
      .email({ address })
      .contact()
      .user();

    const session = await this.sessionRepository.createAccountRecoverySession(user);

    await this.emailAccountRecoveryRepository.sendRecoveryLink(address, {
      token: session.token,
    });

    return session;
  }

  private async sendSMSAccountRecoveryLink(number: string) {
    const user = await this.db
      .phoneNumber({ number })
      .contact()
      .user();

    const session = await this.sessionRepository.createAccountRecoverySession(user);

    await this.smsAccountRecoveryRepository.sendRecoveryLink(number, {
      token: session.token,
    });

    return session;
  }

  async recoverAccount({
    args: {
      emailRecovery: { address },
      smsRecovery: { number },
    },
  }: QueryRecoverAccountArgs): Promise<Session> {
    if (Boolean(address)) {
      return this.sendEmailAccountRecoveryLink(address);
    }

    return this.sendSMSAccountRecoveryLink(number);
  }

  async resetPassword(
    { args: { password } }: MutationResetPasswordArgs,
    usr: User,
  ): Promise<Session> {
    const user = await this.db.updateUser({
      where: {
        id: usr.id,
      },
      data: {
        account: {
          update: {
            password: await hash(password, await genSalt()),
          },
        },
      },
    });

    return await this.sessionRepository.createAuthenticationSession(user);
  }
}
