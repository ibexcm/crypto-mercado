import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { BankRepository } from "./repositories/BankRepository";

export const bankRepositoryInjectionKey: InjectionKey<BankRepository> = {
  name: "BankRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);

    return new BankRepository(db);
  },
};
