import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { IBitcoinAPIRepository } from "./interfaces/IBitcoinAPIRepository";
import { BitcoinAPIRepository } from "./repositories/BitcoinAPIRepository";

export const BitcoinAPIRepositoryInjectionKey: InjectionKey<IBitcoinAPIRepository> = {
  name: "BitcoinAPIRepository",
  scope: InjectionKeyScope.singleton,
  closure: _ => new BitcoinAPIRepository(),
};
