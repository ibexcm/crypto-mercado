import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { CurrencyRepository } from "./repositories/CurrencyRepository";

export const currencyRepositoryInjectionKey: InjectionKey<CurrencyRepository> = {
  name: "CurrencyRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    return new CurrencyRepository(db);
  },
};
