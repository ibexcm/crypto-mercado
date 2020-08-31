export interface ISMSAccountRecoveryRepository {
  sendRecoveryLink(to: string, from: string, host: string, { token }): Promise<boolean>;
}
