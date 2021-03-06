import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { UserRepository } from "./repositories/UserRepository";

export const UserRepositoryInjectionKeys: InjectionKey<UserRepository> = {
  name: "UserRepository",
  scope: InjectionKeyScope.singleton,
  closure: (dependencies) => {
    return new UserRepository();
  },
};
