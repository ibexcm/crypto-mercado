import gql from "graphql-tag";

export const GetAccountRecoveryLinkQuery = gql`
  query GetAccountRecoveryLink($args: SendEmailVerificationCodeInput!) {
    recoverAccount(args: $args)
  }
`;
