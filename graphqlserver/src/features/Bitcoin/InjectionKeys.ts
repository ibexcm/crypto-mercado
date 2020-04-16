import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { BitcoinAPIRepositoryInjectionKey } from "../../libraries/Crypto/InjectionKeys";
import { IBitcoinRepository } from "./interfaces/IBitcoinRepository";
import { BitcoinRepository } from "./repositories/BitcoinRepository";

export const BitcoinRepositoryInjectionKey: InjectionKey<IBitcoinRepository> = {
  name: "BitcoinRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const BitcoinApiRepository = dependencies.provide(BitcoinAPIRepositoryInjectionKey);
    return new BitcoinRepository(BitcoinApiRepository);
  },
};
