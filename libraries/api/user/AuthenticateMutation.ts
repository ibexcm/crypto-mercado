import gql from "graphql-tag";

export const AuthenticateMutation = gql`
  mutation AuthenticateMutation($username: String!, $password: String!) {
    authenticate(username: $username, password: $password) {
      token
      expiresAt
    }
  }
`;
