import gql from "graphql-tag";

export const CreateUserMutation = gql`
  mutation CreateUserMutation($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      token
      expiresAt
    }
  }
`;
