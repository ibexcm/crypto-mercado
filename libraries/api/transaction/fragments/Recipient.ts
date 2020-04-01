import gql from "graphql-tag";

export const Recipient = gql`
  fragment Recipient on Transaction {
    recipient {
      id
      user {
        id
      }
      cryptoAccount {
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
      bankAccount {
        id
        verifiedAt
        currency {
          id
          name
          symbol
        }
        guatemala {
          id
          accountNumber
          bankAccountType
          fullName
          bank {
            id
            name
          }
        }
      }
    }
  }
`;
