export interface ISMSAccountRecoveryRepository {
  sendRecoveryPasswordLink(
    to: string,
    from: string,
    host: string,
    { token },
  ): Promise<boolean>;
}
