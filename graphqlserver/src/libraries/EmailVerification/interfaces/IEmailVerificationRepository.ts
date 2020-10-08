export interface IEmailVerificationRepository {
  sendVerificationCode(address: string, token: string): Promise<boolean>;
  verifyCode(address: string, code: string): Promise<boolean>;
}
