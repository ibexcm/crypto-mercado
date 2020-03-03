import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { IEmailVerificationRepository } from "./interfaces/IEmailVerificationRepository";
import { EmailVerificationRepository } from "./repository/EmailVerificationRepository";

export const emailVerificationRepositoryInjectionKey: InjectionKey<IEmailVerificationRepository> = {
  name: "emailVerificationRepository",
  scope: InjectionKeyScope.singleton,
  closure: _ => EmailVerificationRepository,
};
