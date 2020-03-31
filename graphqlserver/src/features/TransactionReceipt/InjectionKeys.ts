import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { TransactionReceiptRepository } from "./repositories/TransactionReceiptRepository";

export const transactionReceiptRepositoryInjectionKey: InjectionKey<TransactionReceiptRepository> = {
  name: "TransactionReceiptRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    return new TransactionReceiptRepository(db);
  },
};
