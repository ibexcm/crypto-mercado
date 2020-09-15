import { Dependencies, InjectionKey, InjectionKeyScope } from "../../libraries/di";
import { AuthTokenRepositoryInjectionKeys } from "../authentication/InjectionKeys";
import { AccountRecoveryRepository } from "./repositories";

export const AccountRecoveryRepositoryInjectionKey: InjectionKey<AccountRecoveryRepository> = {
  name: "AccountRecoveryRepository",
  scope: InjectionKeyScope.singleton,
  closure: (dependencies: Dependencies) => {
    const AuthTokenRepository = dependencies.provide(AuthTokenRepositoryInjectionKeys);
    return new AccountRecoveryRepository(AuthTokenRepository);
  },
};
