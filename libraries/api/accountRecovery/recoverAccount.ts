import gql from "graphql-tag";

export const GetAccountRecoveryLink = gql`
  query GetAccountRecoveryLink($args: recoverAccountInput!) {
    recoverAccount(args: $args)
  }
`;
