import { Dependencies, InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { AccountRecoveryRepository } from "./repositories";

export const AccountRecoveryRepositoryInjectionKey: InjectionKey<AccountRecoveryRepository> = {
  name: "AccountRecoveryRepository",
  scope: InjectionKeyScope.singleton,
  closure: (dependencies: Dependencies) => {
    return new AccountRecoveryRepository();
  },
};
