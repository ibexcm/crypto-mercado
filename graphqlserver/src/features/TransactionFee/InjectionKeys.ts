import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { TransactionFeeRepository } from "./repositories/TransactionFeeRepository";

export const TransactionFeeRepositoryInjectionKey: InjectionKey<TransactionFeeRepository> = {
  name: "TransactionFeeRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    return new TransactionFeeRepository(db);
  },
};
