import { InjectionKey, InjectionKeyScope } from "@ziina/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { jwtRepositoryInjectionKey } from "../JSONWebToken";
import { ISessionRepository } from "./interfaces/ISessionRepository";
import { SessionRepository } from "./repositories/SessionRepository";

export const sessionRepositoryInjectionKey: InjectionKey<ISessionRepository> = {
  name: "sessionRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    const jwtRepository = dependencies.provide(jwtRepositoryInjectionKey);

    return new SessionRepository(db, jwtRepository);
  },
};
