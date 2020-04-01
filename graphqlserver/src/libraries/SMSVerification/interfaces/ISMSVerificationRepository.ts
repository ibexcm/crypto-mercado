export interface ISMSVerificationRepository {
  sendVerificationCode(number: string): Promise<boolean>;
  verifyCode(number: string, code: string): Promise<boolean>;
}
