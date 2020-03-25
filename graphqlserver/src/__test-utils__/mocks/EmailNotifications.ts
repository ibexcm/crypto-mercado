import { IEmailNotificationsRepository } from "../../features/EmailVerification/interfaces/IEmailNotificationsRepository";

export const mockEmailNotificationsRepository = (): IEmailNotificationsRepository => {
  return {
    sendAdminKYCApproveUserNotification: jest.fn((address: string) => Promise.resolve()),
  };
};
