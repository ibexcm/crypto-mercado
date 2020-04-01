import gql from "graphql-tag";

export const Receipt = gql`
  fragment Receipt on Transaction {
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
`;
