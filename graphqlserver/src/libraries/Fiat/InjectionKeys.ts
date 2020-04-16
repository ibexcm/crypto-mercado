import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { IExchangeRateAPIRepository } from "./interfaces/IExchangeRateAPIRepository";
import { ExchangeRateAPIRepository } from "./repositories/ExchangeRateAPIRepository";

export const ExchangeRateAPIRepositoryInjectionKey: InjectionKey<IExchangeRateAPIRepository> = {
  name: "ExchangeRateAPIRepository",
  scope: InjectionKeyScope.singleton,
  closure: _ => new ExchangeRateAPIRepository(),
};
