import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { emailNotificationsRepositoryInjectionKey } from "../../libraries/EmailVerification";
import { KYCRepository } from "./repositories/KYCRepository";

export const kycRepositoryInjectionKey: InjectionKey<KYCRepository> = {
  name: "KYCRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    const emailNotificationsRepository = dependencies.provide(
      emailNotificationsRepositoryInjectionKey,
    );
    return new KYCRepository(db, emailNotificationsRepository);
  },
};
