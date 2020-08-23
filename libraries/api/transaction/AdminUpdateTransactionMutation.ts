import gql from "graphql-tag";

export const AdminUpdateTransactionMutation = gql`
  mutation AdminUpdateTransactionMutation($args: AdminUpdateTransactionInput!) {
    adminUpdateTransaction(args: $args) {
      id
    }
  }
`;
