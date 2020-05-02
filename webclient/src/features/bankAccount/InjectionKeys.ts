import { Dependencies, InjectionKey, InjectionKeyScope } from "../../libraries/di";
import { BankAccountRepository } from "./repositories";

export const BankAccountRepositoryInjectionKeys: InjectionKey<BankAccountRepository> = {
  name: "BankAccountRepository",
  scope: InjectionKeyScope.singleton,
  closure: (dependencies: Dependencies) => {
    return new BankAccountRepository();
  },
};
