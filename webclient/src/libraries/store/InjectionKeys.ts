import { InjectionKeyScope } from "../di";
import { Store } from "./Store";

export const storeInjectionKey = {
  name: "store",
  scope: InjectionKeyScope.singleton,
  closure: _ => new Store(),
};
