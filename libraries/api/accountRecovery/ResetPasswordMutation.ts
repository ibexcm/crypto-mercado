import gql from "graphql-tag";

export const ResetPasswordMutation = gql`
  mutation ResetPasswordMutation($args: SetPasswordInput!) {
    resetPassword(args: $args) {
      token
      expiresAt
    }
  }
`;
