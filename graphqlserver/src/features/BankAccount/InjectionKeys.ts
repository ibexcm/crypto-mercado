import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { userRepositoryInjectionKey } from "../User/InjectionKeys";
import { BankAccountRepository } from "./repositories/BankAccountRepository";
import { GuatemalaBankAccountRepository } from "./repositories/GuatemalaBankAccountRepository";

export const bankAccountRepositoryInjectionKey: InjectionKey<BankAccountRepository> = {
  name: "BankAccountRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    const UserRepository = dependencies.provide(userRepositoryInjectionKey);
    return new BankAccountRepository(db, UserRepository);
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
