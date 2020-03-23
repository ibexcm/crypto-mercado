import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { emailVerificationRepositoryInjectionKey } from "../EmailVerification";
import { fileManagementRepositoryInjectionKey } from "../FileManagement";
import { sessionRepositoryInjectionKey } from "../Session";
import { smsVerificationRepositoryInjectionKey } from "../SMSVerification";
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
    const fileManagementRepository = dependencies.provide(
      fileManagementRepositoryInjectionKey,
    );

    return new OnboardingRepository(
      db,
      sessionRepository,
      smsVerificationRepository,
      fileManagementRepository,
      emailVerificationRepository,
    );
  },
};
