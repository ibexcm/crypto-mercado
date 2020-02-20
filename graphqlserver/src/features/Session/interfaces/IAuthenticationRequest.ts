import { Account, User } from "@ibexcm/database";

export interface IAuthenticationRequest {
  user: User;
  account: Account;
  createdAt: string;
  expiresAt: string;
}
