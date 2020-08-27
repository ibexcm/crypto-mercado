import { Transaction } from "@ibexcm/database";

export interface IEmailNotificationsRepository {
  sendAdminKYCApproveUserNotification(address: string): Promise<void>;
  sendTransactionRequestNotification(
    address: string,
    {
      transaction,
      fromCurrencySymbol,
      toCurrencySymbol,
      clientID,
      isFiatToCryptoTransaction,
    }: {
      transaction: Transaction;
      fromCurrencySymbol: string;
      toCurrencySymbol: string;
      clientID: string;
      isFiatToCryptoTransaction: boolean;
    },
  ): Promise<void>;
  sendTransactionSuccessNotification(
    address: string,
    {
      transaction,
      fromCurrencySymbol,
      toCurrencySymbol,
      clientID,
      isFiatToCryptoTransaction,
    }: {
      transaction: Transaction;
      fromCurrencySymbol: string;
      toCurrencySymbol: string;
      clientID: string;
      isFiatToCryptoTransaction: boolean;
    },
  ): Promise<void>;
  sendAdminTransactionEvidenceSubmittedNotification({
    transaction,
    clientID,
  }: {
    transaction: Transaction;
    clientID: string;
  }): Promise<void>;
}
