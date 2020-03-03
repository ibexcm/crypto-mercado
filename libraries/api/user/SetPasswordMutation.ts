import gql from "graphql-tag";

export const SetPasswordMutation = gql`
  mutation SetPasswordMutation($args: SetPasswordInput!) {
    setPassword(args: $args) {
      token
      expiresAt
    }
  }
`;
