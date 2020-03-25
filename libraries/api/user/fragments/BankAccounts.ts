import gql from "graphql-tag";

export const BankAccounts = gql`
  fragment BankAccounts on User {
    bankAccounts {
      id
      currency {
        name
        symbol
      }
      guatemala {
        id
        verifiedAt
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
