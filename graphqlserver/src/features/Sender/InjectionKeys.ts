import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { SenderRepository } from "./repositories/SenderRepository";

export const senderRepositoryInjectionKey: InjectionKey<SenderRepository> = {
  name: "SenderRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    return new SenderRepository(db);
  },
};
