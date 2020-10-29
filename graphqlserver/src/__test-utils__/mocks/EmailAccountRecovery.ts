import { IEmailAccountRecoveryRepository } from "../../libraries/EmailVerification";

export const mockEmailAccountRecoveryRepository = (): IEmailAccountRecoveryRepository => {
  return {
    sendRecoveryLink: jest.fn((address: string, { token }) => Promise.resolve(true)),
  };
};
