import { Account, User } from "@ziina/database";

export interface IAuthenticationRequest {
  user: User;
  account: Account;
  createdAt: string;
  expiresAt: string;
}
