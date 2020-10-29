import { Dependencies, InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { NavigationRepository } from "./repository";

export const NavigationRepositoryInjectionKey: InjectionKey<NavigationRepository> = {
  name: "NavigationRepository",
  scope: InjectionKeyScope.singleton,
  closure: (dependencies: Dependencies) => {
    return new NavigationRepository();
  },
};
