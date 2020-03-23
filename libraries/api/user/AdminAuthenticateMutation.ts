import gql from "graphql-tag";

export const AdminAuthenticateMutation = gql`
  mutation AdminAuthenticateMutation($args: AdminAuthenticateInput!) {
    adminAuthenticate(args: $args) {
      token
      expiresAt
    }
  }
`;
