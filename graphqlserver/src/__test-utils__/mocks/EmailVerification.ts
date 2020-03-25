import { IEmailVerificationRepository } from "../../features/EmailVerification/interfaces/IEmailVerificationRepository";

export const mockEmailVerificationRepository = (): IEmailVerificationRepository => {
  return {
    sendVerificationCode: jest.fn((address: string) => Promise.resolve(true)),
    verifyCode: jest.fn((address: string, code: string) => Promise.resolve(true)),
  };
};
