import gql from "graphql-tag";

export const GetTransactionBreakdownQuery = gql`
  query GetTransactionBreakdownQuery($args: GetTransactionBreakdownInput!) {
    getTransactionBreakdown(args: $args) {
      ... on FiatToBitcoinTransactionBreakdown {
        price {
          key
          value
        }
        amount {
          key
          value
        }
        fee {
          key
          value
        }
        tax {
          key
          value
        }
        total {
          key
          value
        }
        exchangeRate {
          key
          value
        }
        priceAtRate {
          key
          value
        }
      }
      ... on BitcoinToFiatTransactionBreakdown {
        price {
          key
          value
        }
        amount {
          key
          value
        }
        fee {
          key
          value
        }
        tax {
          key
          value
        }
        total {
          key
          value
        }
        exchangeRate {
          key
          value
        }
        priceAtRate {
          key
          value
        }
      }
    }
  }
`;
