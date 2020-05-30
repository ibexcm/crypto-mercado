import { InjectionKey, InjectionKeyScope } from "../../libraries/di";
import { TransactionRepository } from "./repositories/TransactionRepository";

export const TransactionRepositoryInjectionKeys: InjectionKey<TransactionRepository> = {
  name: "TransactionRepository",
  scope: InjectionKeyScope.singleton,
  closure: (dependencies) => {
    return new TransactionRepository();
  },
};
