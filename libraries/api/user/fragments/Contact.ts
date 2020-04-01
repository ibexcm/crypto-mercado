import gql from "graphql-tag";

export const Contact = gql`
  fragment Contact on User {
    contact {
      id
      phoneNumber {
        id
        number
      }
      email {
        id
        address
      }
    }
  }
`;
