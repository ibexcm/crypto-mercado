import gql from "graphql-tag";
import { Transaction } from "./fragments";

export const AdminGetTransactionsQuery = gql`
  query AdminGetTransactionsQuery($args: AdminGetTransactionsInput) {
    adminGetTransactions(args: $args) {
      ...Transaction
    }
  }
  ${Transaction}
`;
