import gql from "graphql-tag";

export const GetCurrenciesByCountryQuery = gql`
  query GetCurrenciesByCountryQuery($args: GetCurrenciesByCountryInput!) {
    getCurrenciesByCountry(args: $args) {
      id
      name
      symbol
    }
  }
`;
