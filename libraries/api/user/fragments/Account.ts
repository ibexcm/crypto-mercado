import gql from "graphql-tag";

export const Account = gql`
  fragment Account on User {
    account {
      id
      clientID
    }
  }
`;
