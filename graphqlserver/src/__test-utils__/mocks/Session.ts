import { Contact } from "@ziina/database";
import { Session, User } from "@ziina/libraries/api";
import { ISessionRepository } from "../../features/Session/interfaces/ISessionRepository";

export const mockSessionRepository = (
  token: string,
  expiresAt: Date,
): ISessionRepository => {
  return {
    createAuthentication: jest.fn(
      (user: User) => new Promise<Session>(resolve => resolve({ token, expiresAt })),
    ),
    createSignupSession: jest.fn((contact: Contact) =>
      Promise.resolve<Session>({ token, expiresAt }),
    ),
  };
};
