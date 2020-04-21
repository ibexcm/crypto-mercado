import gql from "graphql-tag";

export const CryptoAccounts = gql`
  fragment CryptoAccounts on User {
    cryptoAccounts {
      id
      currency {
        id
        name
        symbol
      }
      bitcoin {
        id
        address
        xpub
      }
    }
  }
`;
