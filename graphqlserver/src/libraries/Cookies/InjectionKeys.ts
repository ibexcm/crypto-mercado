import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { ICookiesGenRepository } from "./interfaces";
import { CookiesGenRepository } from "./repositories";

export const cookiesGenRepositoryInjectionKey: InjectionKey<ICookiesGenRepository> = {
  name: "cookiesGenRepository",
  scope: InjectionKeyScope.singleton,
  closure: _ => CookiesGenRepository,
};
