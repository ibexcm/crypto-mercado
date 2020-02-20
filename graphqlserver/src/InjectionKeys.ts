import { Prisma, prisma } from "@ziina/database";
import { InjectionKey, InjectionKeyScope } from "@ziina/libraries/di";
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
