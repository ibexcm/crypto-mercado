import gql from "graphql-tag";

export const UserRole = gql`
  fragment UserRole on User {
    role {
      id
      type
    }
  }
`;
