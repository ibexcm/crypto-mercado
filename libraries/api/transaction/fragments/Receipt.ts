import gql from "graphql-tag";
import { CurrencyFragment } from "./CurrencyFragment";

export const Receipt = gql`
  fragment Receipt on Transaction {
    receipt {
      id
      paidAt
      createdAt
      fee {
        id
        fee
      }
      tax {
        id
        tax
      }
      exchangeRate {
        id
        price
        currency {
          ...CurrencyFragment
        }
      }
      evidence {
        id
        bitcoinReceipt {
          id
          transactionHash
          price {
            value
            currency {
              ...CurrencyFragment
            }
          }
        }
        bankReceipt {
          id
          fileHash
        }
      }
      fromCurrency {
        ...CurrencyFragment
      }
      toCurrency {
        ...CurrencyFragment
      }
    }
  }
  ${CurrencyFragment}
`;
