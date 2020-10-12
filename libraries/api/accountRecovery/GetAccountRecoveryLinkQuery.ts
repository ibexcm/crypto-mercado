import gql from "graphql-tag";

export const GetAccountRecoveryLinkQuery = gql`
  query GetAccountRecoveryLink($args: recoverAccountInput!) {
    recoverAccount(args: $args)
  }
`;
