import { InjectionKeyScope } from "@ibexcm/libraries/di";
import { Store } from "./Store";

export const storeInjectionKey = {
  name: "store",
  scope: InjectionKeyScope.singleton,
  closure: (_) => new Store(),
};
