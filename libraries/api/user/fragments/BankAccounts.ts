import gql from "graphql-tag";

export const BankAccounts = gql`
  fragment BankAccounts on User {
    bankAccounts {
      currency {
        name
        symbol
      }
      guatemala {
        accountNumber
        bankAccountType
        fullName
        bank {
          name
        }
      }
    }
  }
`;
