import { Account, User } from "@ziina/database";
import { Session } from "@ziina/libraries/api";

export interface ISessionRepository {
  createAuthentication(user: User): Promise<Session>;
  createSignupSession(account: Account): Promise<Session>;
}
