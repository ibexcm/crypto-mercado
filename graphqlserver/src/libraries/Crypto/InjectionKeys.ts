import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { ExchangeRateRepositoryInjectionKey } from "../../features/ExchangeRate/InjectionKeys";
import { IBitcoinAPIRepository } from "./interfaces/IBitcoinAPIRepository";
import { BitcoinAPIRepository } from "./repositories/BitcoinAPIRepository";

export const BitcoinAPIRepositoryInjectionKey: InjectionKey<IBitcoinAPIRepository> = {
  name: "BitcoinAPIRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const exchangeRateRepository = dependencies.provide(ExchangeRateRepositoryInjectionKey);

    const bitcoinAPIRepository = new BitcoinAPIRepository(exchangeRateRepository);

    return bitcoinAPIRepository;
  },
};
