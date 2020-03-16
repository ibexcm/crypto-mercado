import { IResolvers } from "graphql-tools";
import { Mutation } from "./Mutation";
import { Query } from "./Query";
import { Type } from "./Type";

export const resolvers: IResolvers = {
  Query,
  Mutation,
  ...Type,
};
