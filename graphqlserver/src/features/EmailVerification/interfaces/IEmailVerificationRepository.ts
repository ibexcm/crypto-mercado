export interface IEmailVerificationRepository {
  sendVerificationCode(address: string): Promise<boolean>;
  verifyCode(address: string, code: string): Promise<boolean>;
}
