import gql from "graphql-tag";

export const BankAccounts = gql`
  fragment BankAccounts on User {
    bankAccounts {
      id
      verifiedAt
      currency {
        name
        symbol
      }
      guatemala {
        id
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
