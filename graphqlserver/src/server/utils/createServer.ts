import { binding } from "@ibexcm/database";
import { IDependencies } from "@ibexcm/libraries/di";
import bodyparser from "body-parser";
import { GraphQLServer, PubSub } from "graphql-yoga";
import { ContextParameters } from "graphql-yoga/dist/types";
import { Prisma as PrismaBinding } from "prisma-binding";
import { jwtRepositoryInjectionKey } from "../../features/JSONWebToken";
import { permissions } from "../../permissions";
import { resolvers } from "../../schema/resolvers";
import { IContext } from "../interfaces/IContext";

export const createServer = (dependencies: IDependencies) => {
  const server = new GraphQLServer({
    typeDefs: ["./src/schema/schema.graphql"],
    resolvers,
    middlewares: [permissions],
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

  return server;
};
