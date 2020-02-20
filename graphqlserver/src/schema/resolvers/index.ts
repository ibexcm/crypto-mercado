import { IResolvers } from "graphql-tools";
import { Mutation } from "./Mutation";
import { Query } from "./Query";

export const resolvers: IResolvers = {
  Query,
  Mutation,
};
