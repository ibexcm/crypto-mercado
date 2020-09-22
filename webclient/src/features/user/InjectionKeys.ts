import { Dependencies, InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { AuthTokenRepositoryInjectionKeys } from "../authentication/InjectionKeys";
import { UserRepository } from "./repositories";

export const UserRepositoryInjectionKeys: InjectionKey<UserRepository> = {
  name: "UserRepository",
  scope: InjectionKeyScope.singleton,
  closure: (dependencies: Dependencies) => {
    const AuthTokenRepository = dependencies.provide(AuthTokenRepositoryInjectionKeys);
    return new UserRepository(AuthTokenRepository);
  },
};
