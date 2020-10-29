import { Prisma, User } from "@ibexcm/database";
import {
  MutationResetPasswordArgs,
  QueryRecoverAccountArgs,
  Session,
} from "@ibexcm/libraries/api";
import { genSalt, hash } from "bcryptjs";
import { IEmailAccountRecoveryRepository } from "../../../libraries/EmailVerification";
import { ISessionRepository } from "../../../libraries/Session";

export class AccountRecoveryRepository {
  private db: Prisma;
  private sessionRepository: ISessionRepository;
  private emailAccountRecoveryRepository: IEmailAccountRecoveryRepository;

  constructor(
    db: Prisma,
    sessionRepository: ISessionRepository,
    emailAccountRecoveryRepository: IEmailAccountRecoveryRepository,
  ) {
    this.db = db;
    this.sessionRepository = sessionRepository;
    this.emailAccountRecoveryRepository = emailAccountRecoveryRepository;
  }

  async recoverAccount({ args: { address } }: QueryRecoverAccountArgs): Promise<Boolean> {
    const user = await this.db
      .email({ address })
      .contact()
      .user();

    const { token } = await this.sessionRepository.createAccountRecoverySession(user);

    return await this.emailAccountRecoveryRepository.sendRecoveryLink(address, {
      token,
    });
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
