import { Prisma } from "@ibexcm/database";
import {
  MutationAdminAuthenticateArgs,
  MutationAuthenticateArgs,
  Session,
} from "@ibexcm/libraries/api";
import { ISessionRepository } from "../../Session/interfaces/ISessionRepository";

export class AuthenticationRepository {
  private db: Prisma;
  private sessionRepository: ISessionRepository;

  constructor(db: Prisma, sessionRepository: ISessionRepository) {
    this.db = db;
    this.sessionRepository = sessionRepository;
  }

  async authenticate({
    args: { address, password },
  }: MutationAuthenticateArgs): Promise<Session> {
    const user = await this.db
      .email({ address })
      .contact()
      .user();

    return await this.sessionRepository.createAuthenticationSession(user);
  }

  async adminAuthenticate({
    args: { address },
  }: MutationAdminAuthenticateArgs): Promise<Session> {
    const user = await this.db
      .email({ address })
      .contact()
      .user();

    return await this.sessionRepository.createAuthenticationSession(user);
  }
}
