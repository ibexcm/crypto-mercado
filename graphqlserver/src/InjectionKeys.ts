import { Prisma, prisma } from "@ibexcm/database";
import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { Logger } from "winston";
import { logger } from "./server/utils/logger";

export const dbInjectionKey: InjectionKey<Prisma> = {
  name: "db",
  scope: InjectionKeyScope.singleton,
  closure: _ => prisma,
};

export const loggerInjectionKey: InjectionKey<Logger> = {
  name: "logger",
  scope: InjectionKeyScope.singleton,
  closure: _ => logger,
};
