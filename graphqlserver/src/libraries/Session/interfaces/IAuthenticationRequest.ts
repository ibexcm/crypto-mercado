import { User } from "@ibexcm/database";

export interface IAuthenticationRequest {
  user: User;
  createdAt: string;
  expiresAt: string;
}
