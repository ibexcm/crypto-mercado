import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { emailNotificationsRepositoryInjectionKey } from "../../libraries/EmailVerification";
import { TransactionReceiptRepository } from "./repositories/TransactionReceiptRepository";

export const TransactionReceiptRepositoryInjectionKey: InjectionKey<TransactionReceiptRepository> = {
  name: "TransactionReceiptRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    const emailNotificationsRepository = dependencies.provide(
      emailNotificationsRepositoryInjectionKey,
    );

    return new TransactionReceiptRepository(db, emailNotificationsRepository);
  },
};
