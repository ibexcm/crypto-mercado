import gql from "graphql-tag";

export const Contact = gql`
  fragment Contact on Contact {
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
`;
