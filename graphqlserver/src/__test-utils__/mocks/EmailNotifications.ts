import { IEmailNotificationsRepository } from "../../libraries/EmailVerification/interfaces/IEmailNotificationsRepository";

export const mockEmailNotificationsRepository = (): IEmailNotificationsRepository => {
  return {
    sendAdminKYCApproveUserNotification: jest.fn((address: string) => Promise.resolve()),
  };
};
