import gql from "graphql-tag";

export const VerifyEmailMutation = gql`
  mutation VerifyEmailMutation($args: VerifyEmailInput!) {
    verifyEmail(args: $args) {
      token
      expiresAt
    }
  }
`;
