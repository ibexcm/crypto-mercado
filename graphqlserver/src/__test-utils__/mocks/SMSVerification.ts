import { ISMSVerificationRepository } from "../../features/SMSVerification";

export const mockSMSVerificationRepository = (): ISMSVerificationRepository => {
  return {
    sendVerificationCode: jest.fn(
      (number: string) => new Promise<boolean>(resolve => resolve(true)),
    ),
    verifyCode: jest.fn(
      (number: string, code: string) => new Promise<boolean>(resolve => resolve(true)),
    ),
  };
};
