import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { emailAccountRecoveryRepositoryInjectionKey } from "../../libraries/EmailVerification";
import { sessionRepositoryInjectionKey } from "../../libraries/Session";
import { AccountRecoveryRepository } from "./repositories/AccountRecoveryRepository";

export const accountRecoveryInjectioKey: InjectionKey<AccountRecoveryRepository> = {
  name: "AccountRecoveryRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    const sessionRepository = dependencies.provide(sessionRepositoryInjectionKey);

    const emailAccountRecoveryRepository = dependencies.provide(
      emailAccountRecoveryRepositoryInjectionKey,
    );

    return new AccountRecoveryRepository(
      db,
      sessionRepository,
      emailAccountRecoveryRepository,
    );
  },
};
