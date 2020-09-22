import { Dependencies, InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { AuthTokenRepositoryInjectionKeys } from "../authentication/InjectionKeys";
import { AccountRecoveryRepository, ValidationRepository } from "./repositories";

export const AccountRecoveryRepositoryInjectionKey: InjectionKey<AccountRecoveryRepository> = {
  name: "AccountRecoveryRepository",
  scope: InjectionKeyScope.singleton,
  closure: (dependencies: Dependencies) => {
    const AuthTokenRepository = dependencies.provide(AuthTokenRepositoryInjectionKeys);
    return new AccountRecoveryRepository(AuthTokenRepository);
  },
};

export const ValidationRepositoryInjectionKey: InjectionKey<ValidationRepository> = {
  name: "ValidationRepository",
  scope: InjectionKeyScope.singleton,
  closure: (dependencies: Dependencies) => {
    return new ValidationRepository();
  },
};
