import { InjectionKey, InjectionKeyScope } from "../../libraries/di";
import { storeInjectionKey } from "../../libraries/store";
import { AuthTokenRepository } from "./repositories/AuthTokenRepository";

export const AuthTokenRepositoryInjectionKeys: InjectionKey<AuthTokenRepository> = {
  name: "AuthTokenRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const store = dependencies.provide(storeInjectionKey);
    return new AuthTokenRepository(store);
  },
};
