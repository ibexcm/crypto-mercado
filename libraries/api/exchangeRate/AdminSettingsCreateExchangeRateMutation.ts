import gql from "graphql-tag";

export const AdminSettingsCreateExchangeRateMutation = gql`
  mutation AdminSettingsCreateExchangeRateMutation(
    $args: AdminSettingsCreateExchangeRateInput!
  ) {
    adminSettingsCreateExchangeRate(args: $args) {
      price
      currency {
        symbol
      }
    }
  }
`;
