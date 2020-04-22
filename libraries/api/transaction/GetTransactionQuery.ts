import gql from "graphql-tag";
import { Transaction } from "./fragments";

export const GetTransactionQuery = gql`
  query GetTransactionQuery($args: GetTransactionInput!) {
    getTransaction(args: $args) {
      ...Transaction
    }
  }
  ${Transaction}
`;
