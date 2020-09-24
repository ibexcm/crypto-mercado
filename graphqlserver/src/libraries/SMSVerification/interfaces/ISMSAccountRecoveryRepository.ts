export interface ISMSAccountRecoveryRepository {
  sendRecoveryLink(to: string, { token }): Promise<boolean>;
}
