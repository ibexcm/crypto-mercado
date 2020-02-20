import { InjectionKey, InjectionKeyScope } from "@ziina/libraries/di";
import { ISMSVerificationRepository } from "./interfaces/ISMSVerificationRepository";
import { SMSVerificationRepository } from "./repository/SMSVerificationRepository";

export const smsVerificationRepositoryInjectionKey: InjectionKey<ISMSVerificationRepository> = {
  name: "smsVerificationRepository",
  scope: InjectionKeyScope.singleton,
  closure: _ => SMSVerificationRepository,
};
