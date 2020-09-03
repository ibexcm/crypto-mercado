export interface ISMSAccountRecoveryRepository {
  sendRecoveryLink(to: string, from: string, { token }): Promise<boolean>;
}
