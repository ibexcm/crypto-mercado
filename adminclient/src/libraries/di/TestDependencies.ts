import { Dependencies } from "./Dependencies";
import { InjectionKey } from "./InjectionKey";
import { InjectionKeyScope } from "./InjectionKeyScope";

type Closure<T> = (dependencies: Dependencies) => T;

export class TestDependencies extends Dependencies {
  private overrides = new Map<string, Closure<any>>();

  override<T>(injectionKey: InjectionKey<T>, closure: Closure<T>) {
    this.overrides.set(injectionKey.name, closure);
  }

  provide<T>(injectionKey: InjectionKey<T>): T {
    const override = this.overrides.get(injectionKey.name);

    switch (injectionKey.scope) {
      case InjectionKeyScope.singleton:
        let object = this.cache.get(injectionKey.name) as T;
        if (Boolean(object)) {
          return object;
        }

        if (Boolean(override)) {
          object = override(this) as T;
        } else {
          object = injectionKey.closure(this);
        }

        this.cache.set(injectionKey.name, object);

        return object;
      case InjectionKeyScope.transient:
        if (Boolean(override)) {
          return override(this) as T;
        }

        return injectionKey.closure(this);
    }
  }
}
