import { binding } from "@ibexcm/database";
import { IDependencies } from "@ibexcm/libraries/di";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import { GraphQLServer, PubSub } from "graphql-yoga";
import { ContextParameters } from "graphql-yoga/dist/types";
import { Prisma as PrismaBinding } from "prisma-binding";
import { jwtRepositoryInjectionKey } from "../../libraries/JSONWebToken";
import { permissions } from "../../middleware/permissions";
import { transforms } from "../../middleware/transforms";
import { resolvers } from "../../schema/resolvers";
import { IContext } from "../interfaces/IContext";

export const createServer = (dependencies: IDependencies) => {
  const server = new GraphQLServer({
    typeDefs: ["./src/schema/schema.graphql"],
    resolvers,
    middlewares: [permissions, transforms],
    context: (contextParameters: ContextParameters): IContext => ({
      ...contextParameters,
      binding: new PrismaBinding(binding),
      dependencies,
      pubsub: new PubSub(),
    }),
  });

  const jwtRepository = dependencies.provide(jwtRepositoryInjectionKey);

  server.express.use(jwtRepository.auth.optional);
  server.express.use(bodyparser.urlencoded({ extended: false }));
  server.express.use(bodyparser.json());
  server.express.use(cookieParser());

  return server;
};
