import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { IJWTRepository } from "./interfaces/IJWTRepository";
import JWTRepository from "./repositories/JWTRepository";

export const jwtRepositoryInjectionKey: InjectionKey<IJWTRepository> = {
  name: "jwtRepository",
  scope: InjectionKeyScope.singleton,
  closure: _ => JWTRepository,
};
