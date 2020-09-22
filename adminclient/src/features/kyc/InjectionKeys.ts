import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { KYCRepository } from "./repositories/KYCRepository";

export const KYCRepositoryInjectionKeys: InjectionKey<KYCRepository> = {
  name: "KYCRepository",
  scope: InjectionKeyScope.singleton,
  closure: (dependencies) => {
    return new KYCRepository();
  },
};
