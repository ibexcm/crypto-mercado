import { ClientOptions } from "prisma-client-lib";
import { config } from "./config";
import { Prisma } from "./generated/client";
import { typeDefs } from "./generated/client/prisma-schema";

console.log("Using Prisma endpoint: ", config.get("prisma").endpoint);

export * from "./generated/client";

export const prisma = new Prisma(config.get("prisma"));
export const binding = { typeDefs, ...config.get("prisma") } as ClientOptions;

export default prisma;
