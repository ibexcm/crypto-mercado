import { Transaction } from "@ibexcm/database";
import { IEmailNotificationsRepository } from "../../libraries/EmailVerification/interfaces/IEmailNotificationsRepository";

export const mockEmailNotificationsRepository = (): IEmailNotificationsRepository => {
  return {
    sendAdminKYCApproveUserNotification: jest.fn((address: string) => Promise.resolve()),
    sendTransactionSuccessNotification: jest.fn(
      (
        address: string,
        {
          transaction,
          fromCurrencySymbol,
          toCurrencySymbol,
        }: {
          transaction: Transaction;
          fromCurrencySymbol: string;
          toCurrencySymbol: string;
        },
      ) => Promise.resolve(),
    ),
  };
};
