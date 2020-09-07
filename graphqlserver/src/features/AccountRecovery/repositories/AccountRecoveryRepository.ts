import { Prisma, User } from "@ibexcm/database";
import {
  MutationResetPasswordArgs,
  QueryRecoverAccountArgs,
  Session,
} from "@ibexcm/libraries/api";
import { genSalt, hash } from "bcryptjs";
import { ICookiesGenRepository } from "../../../libraries/Cookies";
import { IEmailAccountRecoveryRepository } from "../../../libraries/EmailVerification";
import { ISessionRepository } from "../../../libraries/Session";
import { ISMSAccountRecoveryRepository } from "../../../libraries/SMSVerification";
import { IContext } from "../../../server/interfaces/IContext";

export class AccountRecoveryRepository {
  private db: Prisma;
  private sessionRepository: ISessionRepository;
  private cookiesGenRepository: ICookiesGenRepository;
  private emailAccountRecoveryRepository: IEmailAccountRecoveryRepository;
  private smsAccountRecoveryRepository: ISMSAccountRecoveryRepository;

  constructor(
    db: Prisma,
    sessionRepository: ISessionRepository,
    cookiesGenRepository: ICookiesGenRepository,
    emailAccountRecoveryRepository: IEmailAccountRecoveryRepository,
    smsAccountRecoveryRepository: ISMSAccountRecoveryRepository,
  ) {
    this.db = db;
    this.sessionRepository = sessionRepository;
    this.cookiesGenRepository = cookiesGenRepository;
    this.emailAccountRecoveryRepository = emailAccountRecoveryRepository;
    this.smsAccountRecoveryRepository = smsAccountRecoveryRepository;
  }

  async recoverAccount(
    {
      args: {
        address: { address },
        number: { number },
      },
    }: QueryRecoverAccountArgs,
    response: IContext["response"],
  ): Promise<Session> {
    let user;

    if (Boolean(address)) {
      user = await this.db
        .email({ address })
        .contact()
        .user();
    } else if (Boolean(number)) {
      user = await this.db
        .phoneNumber({ number })
        .contact()
        .user();
    }

    const { token, expiresAt } = await this.sessionRepository.createAccountRecoverySession(
      user,
    );

    if (Boolean(address))
      await this.emailAccountRecoveryRepository.sendRecoveryLink(address, { token });
    else if (Boolean(number))
      await this.smsAccountRecoveryRepository.sendRecoveryLink(number, { token });

    const cookieValues = await this.cookiesGenRepository.createCookie(token);
    response.cookie(...cookieValues);

    return {
      token,
      expiresAt,
    };
  }

  async resetPassword(
    { args: { password } }: MutationResetPasswordArgs,
    user: User,
  ): Promise<Session> {
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
  }
}
