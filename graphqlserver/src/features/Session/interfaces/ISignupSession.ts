import { Account, User } from "@ziina/database";

export interface ISignupSession {
  user?: User;
  account: Account;
  createdAt: string;
  expiresAt: string;
}
