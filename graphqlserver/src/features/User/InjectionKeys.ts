import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { UserRepository } from "./repositories/UserRepository";

export const userRepositoryInjectionKey: InjectionKey<UserRepository> = {
  name: "UserRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    return new UserRepository(db);
  },
};
