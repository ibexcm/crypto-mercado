import gql from "graphql-tag";

export const GetBanksByCountryQuery = gql`
  query GetBanksByCountryQuery($args: GetBanksByCountryInput!) {
    getBanksByCountry(args: $args) {
      id
      name
      country {
        id
        name
        symbol
        phoneNumberCode
      }
    }
  }
`;
