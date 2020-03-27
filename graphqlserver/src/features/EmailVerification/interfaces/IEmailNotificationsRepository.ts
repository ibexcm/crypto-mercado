export interface IEmailNotificationsRepository {
  sendAdminKYCApproveUserNotification(address: string): Promise<void>;
}
