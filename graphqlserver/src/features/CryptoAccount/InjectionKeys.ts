import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { CryptoAccountRepository } from "./repositories/CryptoAccountRepository";

export const cryptoAccountRepositoryInjectionKey: InjectionKey<CryptoAccountRepository> = {
  name: "CryptoAccountRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    return new CryptoAccountRepository(db);
  },
};
