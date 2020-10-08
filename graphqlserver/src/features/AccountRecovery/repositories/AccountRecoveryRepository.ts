import { Prisma, User } from "@ibexcm/database";
import {
  MutationResetPasswordArgs,
  QueryRecoverAccountArgs,
  Session,
} from "@ibexcm/libraries/api";
import { isValidEmail, isValidPhoneNumber } from "@ibexcm/libraries/validation";
import { genSalt, hash } from "bcryptjs";
import { IEmailAccountRecoveryRepository } from "../../../libraries/EmailVerification";
import { ISessionRepository } from "../../../libraries/Session";
import { ISMSAccountRecoveryRepository } from "../../../libraries/SMSVerification";
import { AccountRecoveryError } from "../errors/AccountRecoveryError";

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

  async recoverAccount({
    args: {
      emailRecovery: { address },
      smsRecovery: { number },
    },
  }: QueryRecoverAccountArgs): Promise<Boolean> {
    if (Boolean(address)) {
      return await this.sendEmailAccountRecoveryLink(address);
    }

    return await this.sendSMSAccountRecoveryLink(number);
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

  private async sendEmailAccountRecoveryLink(address: string): Promise<boolean> {
    if (isValidEmail(address)) {
      throw AccountRecoveryError.invalidEmailAddressError;
    }

    const user = await this.db
      .email({ address })
      .contact()
      .user();

    const { token } = await this.sessionRepository.createAccountRecoverySession(user);

    return await this.emailAccountRecoveryRepository.sendRecoveryLink(address, {
      token,
    });
  }

  private async sendSMSAccountRecoveryLink(number: string): Promise<boolean> {
    if (isValidPhoneNumber(number)) {
      throw AccountRecoveryError.invalidPhoneNumberError;
    }

    const user = await this.db
      .phoneNumber({ number })
      .contact()
      .user();

    const { token } = await this.sessionRepository.createAccountRecoverySession(user);

    return await this.smsAccountRecoveryRepository.sendRecoveryLink(number, {
      token,
    });
  }
}
