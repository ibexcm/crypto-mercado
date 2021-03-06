import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { sessionRepositoryInjectionKey } from "../../libraries/Session";
import { AuthenticationRepository } from "./repositories/AuthenticationRepository";

export const authenticationRepositoryInjectionKey: InjectionKey<AuthenticationRepository> = {
  name: "AuthenticationRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    const sessionRepository = dependencies.provide(sessionRepositoryInjectionKey);

    return new AuthenticationRepository(db, sessionRepository);
  },
};
