import gql from "graphql-tag";

export const Contact = gql`
  fragment Contact on User {
    contact {
      phoneNumber {
        number
      }
      email {
        address
      }
    }
  }
`;
