import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { ISMSAccountRecoveryRepository, ISMSVerificationRepository } from "./interfaces";
import { SMSAccountRecoveryRepository, SMSVerificationRepository } from "./repository";

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
