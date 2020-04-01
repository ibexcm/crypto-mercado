import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { IEmailNotificationsRepository } from "./interfaces/IEmailNotificationsRepository";
import { IEmailVerificationRepository } from "./interfaces/IEmailVerificationRepository";
import { EmailNotificationsRepository } from "./repository/EmailNotificationsRepository";
import { EmailVerificationRepository } from "./repository/EmailVerificationRepository";

export const emailVerificationRepositoryInjectionKey: InjectionKey<IEmailVerificationRepository> = {
  name: "emailVerificationRepository",
  scope: InjectionKeyScope.singleton,
  closure: _ => EmailVerificationRepository,
};

export const emailNotificationsRepositoryInjectionKey: InjectionKey<IEmailNotificationsRepository> = {
  name: "emailNotificationsRepository",
  scope: InjectionKeyScope.singleton,
  closure: _ => EmailNotificationsRepository,
};
