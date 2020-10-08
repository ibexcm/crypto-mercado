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

  async recoverAccount(input: QueryRecoverAccountArgs): Promise<Boolean> {
    const {
      args: {
        emailRecovery: { address },
        smsRecovery: { number },
      },
    } = this.clearInvalidValues(input);

    if (Boolean(address)) {
      return await this.sendEmailAccountRecoveryLink(address);
    } else if (Boolean(number)) {
      return await this.sendSMSAccountRecoveryLink(number);
    }
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
    const user = await this.db
      .phoneNumber({ number })
      .contact()
      .user();

    const { token } = await this.sessionRepository.createAccountRecoverySession(user);

    return await this.smsAccountRecoveryRepository.sendRecoveryLink(number, {
      token,
    });
  }

  private clearInvalidValues(input: QueryRecoverAccountArgs): QueryRecoverAccountArgs {
    const {
      args: {
        emailRecovery: { address },
        smsRecovery: { number },
      },
    } = input;

    try {
      if (Boolean(number === "+502") || !isValidPhoneNumber(number)) {
        delete input.args.smsRecovery.number;
      } else if (!isValidEmail(address)) {
        delete input.args.emailRecovery.address;
      }
    } catch (error) {
      delete input.args.smsRecovery.number;
    }

    return input;
  }
}
