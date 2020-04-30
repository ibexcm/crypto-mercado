import gql from "graphql-tag";
import { BankAccounts } from "../user/fragments";

export const GetAdminBankAccountsQuery = gql`
  query GetAdminBankAccountsQuery {
    getAdminBankAccounts {
      ...BankAccounts
    }
  }
  ${BankAccounts}
`;
