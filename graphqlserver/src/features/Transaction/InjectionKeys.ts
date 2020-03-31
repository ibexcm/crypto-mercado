import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { emailNotificationsRepositoryInjectionKey } from "../../libraries/EmailVerification";
import { TransactionRepository } from "./repositories/TransactionRepository";

export const transactionRepositoryInjectionKey: InjectionKey<TransactionRepository> = {
  name: "TransactionRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    const emailNotificationsRepository = dependencies.provide(
      emailNotificationsRepositoryInjectionKey,
    );
    return new TransactionRepository(db, emailNotificationsRepository);
  },
};
