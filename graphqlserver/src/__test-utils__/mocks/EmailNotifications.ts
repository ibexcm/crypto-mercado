import { Transaction } from "@ibexcm/database";
import { IEmailNotificationsRepository } from "../../libraries/EmailVerification/interfaces/IEmailNotificationsRepository";

export const mockEmailNotificationsRepository = (): IEmailNotificationsRepository => {
  return {
    sendAdminKYCApproveUserNotification: jest.fn((address: string) => Promise.resolve()),
    sendTransactionRequestNotification: jest.fn(
      (
        address: string,
        args: {
          transaction: Transaction;
          fromCurrencySymbol: string;
          toCurrencySymbol: string;
          clientID: string;
          isFiatToCryptoTransaction: boolean;
        },
      ) => Promise.resolve(),
    ),
    sendTransactionSuccessNotification: jest.fn(
      (
        address: string,
        args: {
          transaction: Transaction;
          fromCurrencySymbol: string;
          toCurrencySymbol: string;
          clientID: string;
          isFiatToCryptoTransaction: boolean;
        },
      ) => Promise.resolve(),
    ),
    sendAdminTransactionEvidenceSubmittedNotification: jest.fn(
      (args: { transaction: Transaction; clientID: string }) => Promise.resolve(),
    ),
  };
};
