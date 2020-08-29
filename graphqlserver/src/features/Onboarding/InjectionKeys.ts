import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import {
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../libraries/EmailVerification";
import { fileManagementRepositoryInjectionKey } from "../../libraries/FileManagement";
import { sessionRepositoryInjectionKey } from "../../libraries/Session";
import { smsVerificationRepositoryInjectionKey } from "../../libraries/SMSVerification";
import { OnboardingRepository } from "./repositories/OnboardingRepository";

export const onboardingRepositoryInjectionKey: InjectionKey<OnboardingRepository> = {
  name: "OnboardingRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    const sessionRepository = dependencies.provide(sessionRepositoryInjectionKey);
    const smsVerificationRepository = dependencies.provide(
      smsVerificationRepositoryInjectionKey,
    );
    const emailVerificationRepository = dependencies.provide(
      emailVerificationRepositoryInjectionKey,
    );
    const emailNotificationRepository = dependencies.provide(
      emailNotificationsRepositoryInjectionKey,
    );
    const fileManagementRepository = dependencies.provide(
      fileManagementRepositoryInjectionKey,
    );

    return new OnboardingRepository(
      db,
      sessionRepository,
      smsVerificationRepository,
      fileManagementRepository,
      emailVerificationRepository,
      emailNotificationRepository,
    );
  },
};
