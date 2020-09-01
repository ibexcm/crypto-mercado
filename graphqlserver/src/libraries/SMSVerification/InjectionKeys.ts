import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { SMSVerificationRepository, SMSAccountRecoveryRepository } from "./repository";
import { ISMSVerificationRepository, ISMSAccountRecoveryRepository } from "./interfaces";

export const smsVerificationRepositoryInjectionKey: InjectionKey<ISMSVerificationRepository> = {
  name: "smsVerificationRepository",
  scope: InjectionKeyScope.singleton,
  closure: _ => SMSVerificationRepository,
};

export const smsAccountRecoveryRepositoryInjectionKey: InjectionKey<ISMSAccountRecoveryRepository> = {
  name: "smsAccounRecoveryRepository",
  scope: InjectionKeyScope.singleton,
  closure: _ => SMSAccountRecoveryRepository,
};
