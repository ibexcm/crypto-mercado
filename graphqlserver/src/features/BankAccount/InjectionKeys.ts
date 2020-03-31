import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { BankAccountRepository } from "./repositories/BankAccountRepository";
import { GuatemalaBankAccountRepository } from "./repositories/GuatemalaBankAccountRepository";

export const bankAccountRepositoryInjectionKey: InjectionKey<BankAccountRepository> = {
  name: "BankAccountRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    return new BankAccountRepository(db);
  },
};

export const guatemalaBankAccountRepositoryInjectionKey: InjectionKey<GuatemalaBankAccountRepository> = {
  name: "GuatemalaBankAccountRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    return new GuatemalaBankAccountRepository(db);
  },
};
