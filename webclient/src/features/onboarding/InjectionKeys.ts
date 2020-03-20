import { Dependencies, InjectionKey, InjectionKeyScope } from "../../libraries/di";
import { AuthTokenRepositoryInjectionKeys } from "../authentication/InjectionKeys";
import { OnboardingRepository } from "./repositories";

export const OnboardingRepositoryInjectionKeys: InjectionKey<OnboardingRepository> = {
  name: "OnboardingRepository",
  scope: InjectionKeyScope.singleton,
  closure: (dependencies: Dependencies) => {
    const AuthTokenRepository = dependencies.provide(AuthTokenRepositoryInjectionKeys);
    return new OnboardingRepository(AuthTokenRepository);
  },
};
