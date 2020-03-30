import { InjectionKey, InjectionKeyScope } from "../../libraries/di";
import { storeInjectionKey } from "../../libraries/store";
import { AuthenticationRepository } from "./repositories/AuthenticationRepository";
import { AuthTokenRepository } from "./repositories/AuthTokenRepository";

export const AuthTokenRepositoryInjectionKeys: InjectionKey<AuthTokenRepository> = {
  name: "AuthTokenRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const store = dependencies.provide(storeInjectionKey);
    return new AuthTokenRepository(store);
  },
};

export const AuthenticationRepositoryInjectionKeys: InjectionKey<AuthenticationRepository> = {
  name: "AuthenticationRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const AuthTokenRepository = dependencies.provide(AuthTokenRepositoryInjectionKeys);
    return new AuthenticationRepository(AuthTokenRepository);
  },
};
