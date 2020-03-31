import gql from "graphql-tag";

export const AuthenticateMutation = gql`
  mutation AuthenticateMutation($args: AuthenticateInput!) {
    authenticate(args: $args) {
      token
      expiresAt
    }
  }
`;
