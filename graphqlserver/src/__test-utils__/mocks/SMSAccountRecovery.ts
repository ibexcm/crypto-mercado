import { ISMSAccountRecoveryRepository } from "../../libraries/SMSVerification";

export const mockSMSAccountRecoveryRepository = (): ISMSAccountRecoveryRepository => {
  return {
    sendRecoveryLink: jest.fn((to: string, { token }) => Promise.resolve(true)),
  };
};
