import { Session, User } from "@ibexcm/libraries/api";
import { ISessionRepository } from "../../libraries/Session/interfaces/ISessionRepository";

export const mockSessionRepository = (
  token: string,
  expiresAt: Date,
): ISessionRepository => {
  return {
    createAuthenticationSession: jest.fn(
      (user: User) => new Promise<Session>(resolve => resolve({ token, expiresAt })),
    ),
  };
};
