import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { RxStomp } from "@stomp/rx-stomp";
import { ExchangeRateRepositoryInjectionKey } from "../../features/ExchangeRate/InjectionKeys";
import { IBitcoinAPIRepository, IBitcoinWebSocketRepository } from "./interfaces";
import { BitcoinAPIRepository, BitcoinWebSocketRepository } from "./repositories";

export const BitcoinAPIRepositoryInjectionKey: InjectionKey<IBitcoinAPIRepository> = {
  name: "BitcoinAPIRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const exchangeRateRepository = dependencies.provide(ExchangeRateRepositoryInjectionKey);

    const bitcoinAPIRepository = new BitcoinAPIRepository(exchangeRateRepository);

    return bitcoinAPIRepository;
  },
};

export const BitcoinWebSocketInjectionKey: InjectionKey<IBitcoinWebSocketRepository> = {
  name: "BitcoinWebSocketRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const StompClient = new RxStomp();
    const bitcoinWebSocketRepository = new BitcoinWebSocketRepository(StompClient);

    return bitcoinWebSocketRepository;
  },
};
