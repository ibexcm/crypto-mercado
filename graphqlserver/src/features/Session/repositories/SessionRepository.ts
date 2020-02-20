import { Account, Prisma, User } from "@ziina/database";
import { Session } from "@ziina/libraries/api";
import { DateTime } from "luxon";
import ms from "ms";
import { IJWTRepository } from "../../JSONWebToken/interfaces/IJWTRepository";
import { IAuthenticationRequest } from "../interfaces/IAuthenticationRequest";
import { ISessionRepository } from "../interfaces/ISessionRepository";
import { ISignupSession } from "../interfaces/ISignupSession";

export class SessionRepository implements ISessionRepository {
  db: Prisma;
  jwtRepository: IJWTRepository;

  constructor(db: Prisma, jwtRepository: IJWTRepository) {
    this.db = db;
    this.jwtRepository = jwtRepository;
  }

  async createAuthentication(
    user: User,
    { duration = "7days" }: { duration?: string } = {},
  ): Promise<Session> {
    const account = await this.db.user({ id: user.id }).account();
    const expiresIn = ms(duration);
    const expiresAt = DateTime.utc()
      .plus({ millisecond: expiresIn })
      .toISO();

    const token = this.jwtRepository.sign<IAuthenticationRequest>(
      {
        user,
        account,
        createdAt: DateTime.utc().toISO(),
        expiresAt,
      },
      { expiresIn },
    );

    return {
      token,
      expiresAt,
    };
  }

  async createSignupSession(
    account: Account,
    { duration = "7days" }: { duration?: string } = {},
  ): Promise<Session> {
    const expiresIn = ms(duration);
    const expiresAt = DateTime.utc()
      .plus({ millisecond: expiresIn })
      .toISO();

    const token = this.jwtRepository.sign<ISignupSession>(
      {
        account,
        createdAt: DateTime.utc().toISO(),
        expiresAt,
      },
      { expiresIn },
    );

    return {
      token,
      expiresAt,
    };
  }
}
