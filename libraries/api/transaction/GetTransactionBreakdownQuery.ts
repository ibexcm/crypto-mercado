import gql from "graphql-tag";

export const GetTransactionBreakdownQuery = gql`
  query GetTransactionBreakdownQuery($args: GetTransactionBreakdownInput!) {
    getTransactionBreakdown(args: $args) {
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
      }
    }
  }
`;
