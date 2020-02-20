import { IResolvers } from "graphql-tools";
import { Mutation } from "./Mutation";
import { Query } from "./Query";
import { Union } from "./Union";

export const resolvers: IResolvers = {
  Query,
  Mutation,
  ...Union,
};
