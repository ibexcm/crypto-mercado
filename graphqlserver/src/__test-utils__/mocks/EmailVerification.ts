import { IEmailVerificationRepository } from "features/EmailVerification";

export const mockEmailVerificationRepository = (): IEmailVerificationRepository => {
  return {
    sendVerificationCode: jest.fn(
      (address: string) => new Promise<boolean>(resolve => resolve(true)),
    ),
    verifyCode: jest.fn(
      (address: string, code: string) => new Promise<boolean>(resolve => resolve(true)),
    ),
  };
};
