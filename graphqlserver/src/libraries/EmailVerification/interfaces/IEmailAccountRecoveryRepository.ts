export interface IEmailAccountRecoveryRepository {
  sendRecoveryLink(address: string, { token }): Promise<void>;
}
