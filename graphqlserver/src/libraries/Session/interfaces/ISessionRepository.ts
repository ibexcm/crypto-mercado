import { User } from "@ibexcm/database";
import { Session } from "@ibexcm/libraries/api";

export interface ISessionRepository {
  createAuthenticationSession(user: User): Promise<Session>;
  createAccountRecoverySession(user: User): Promise<Session>;
}
