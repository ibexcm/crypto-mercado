import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { ExchangeRateRepository } from "./repositories/ExchangeRateRepository";

export const ExchangeRateRepositoryInjectionKey: InjectionKey<ExchangeRateRepository> = {
  name: "ExchangeRateRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    return new ExchangeRateRepository(db);
  },
};
