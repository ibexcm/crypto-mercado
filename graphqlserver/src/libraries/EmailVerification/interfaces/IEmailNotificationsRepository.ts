import { Transaction } from "@ibexcm/database";

export interface IEmailNotificationsRepository {
  sendAdminKYCApproveUserNotification(address: string): Promise<void>;
  sendTransactionSuccessNotification(
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
  ): Promise<void>;
}
