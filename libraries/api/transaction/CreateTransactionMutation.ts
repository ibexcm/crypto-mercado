import gql from "graphql-tag";

export const CreateTransactionMutation = gql`
  mutation CreateTransactionMutation($args: CreateTransactionInput!) {
    createTransaction(args: $args) {
      amount
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
            name
            symbol
          }
          guatemala {
            id
            accountNumber
            bankAccountType
            fullName
            bank {
              name
            }
          }
        }
      }
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
            name
            symbol
          }
          guatemala {
            id
            accountNumber
            bankAccountType
            fullName
            bank {
              name
            }
          }
        }
      }
      receipt {
        id
        paidAt
        createdAt
        evidence {
          id
          bitcoinReceipt {
            id
            transactionHash
          }
          bankReceipt {
            id
            fileHash
          }
        }
        fromCurrency {
          id
          name
          symbol
        }
        toCurrency {
          id
          name
          symbol
        }
      }
    }
  }
`;
