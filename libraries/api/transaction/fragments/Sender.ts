import gql from "graphql-tag";

export const Sender = gql`
  fragment Sender on Transaction {
    sender {
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
