import { IDependencies } from "@ibexcm/libraries/di";
import { Request } from "express";
import { PubSub } from "graphql-yoga";
import { ContextParameters } from "graphql-yoga/dist/types";
import { Prisma as PrismaBinding } from "prisma-binding";
import { ExecutionParams } from "subscriptions-transport-ws";
import { IAuthenticationRequest } from "../../features/Session";

export interface IContext extends ContextParameters {
  dependencies: IDependencies;
  binding: PrismaBinding;
  pubsub: PubSub;
  // extensions of ContextParameters override
  request: Request & {
    auth?: IAuthenticationRequest;
  };
  connection: ExecutionParams<{
    Authorization: string;
  }>;
}
