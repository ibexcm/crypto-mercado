import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { RecipientRepository } from "./repositories/RecipientRepository";

export const recipientRepositoryInjectionKey: InjectionKey<RecipientRepository> = {
  name: "RecipientRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    return new RecipientRepository(db);
  },
};
