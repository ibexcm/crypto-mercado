import gql from "graphql-tag";

export const AdminDeleteUserMutation = gql`
  mutation AdminDeleteUserMutation($args: AdminDeleteUserInput!) {
    adminDeleteUser(args: $args) {
      id
    }
  }
`;
