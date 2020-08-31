import gql from "graphql-tag";

export const CurrencyFragment = gql`
  fragment CurrencyFragment on Currency {
    id
    name
    symbol
  }
`;
