import { Prisma, User } from "@ibexcm/database";
import { Session } from "@ibexcm/libraries/api";
import { DateTime } from "luxon";
import ms from "ms";
import { IJWTRepository } from "../../JSONWebToken/interfaces/IJWTRepository";
import { IAuthenticationRequest } from "../interfaces/IAuthenticationRequest";
import { ISessionRepository } from "../interfaces/ISessionRepository";

export class SessionRepository implements ISessionRepository {
  db: Prisma;
  jwtRepository: IJWTRepository;

  constructor(db: Prisma, jwtRepository: IJWTRepository) {
    this.db = db;
    this.jwtRepository = jwtRepository;
  }

  async createAuthenticationSession(
    user: User,
    { duration = "7days" }: { duration?: string } = {},
  ): Promise<Session> {
    const expiresIn = ms(duration);
    const expiresAt = DateTime.utc()
      .plus({ millisecond: expiresIn })
      .toISO();

    const token = this.jwtRepository.sign<IAuthenticationRequest>(
      {
        user,
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

  async createAccountRecoverySession(
    user: User,
    { duration = "5m" }: { duration?: string } = {},
  ): Promise<Session> {
    const expiresIn = ms(duration);
    const expiresAt = DateTime.utc()
      .plus({ millisecond: expiresIn })
      .toISO();

    const token = this.jwtRepository.sign<IAuthenticationRequest>(
      {
        user,
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
