import gql from "graphql-tag";

export const BankAccounts = gql`
  fragment BankAccounts on BankAccount {
    id
    verifiedAt
    currency {
      id
      name
      symbol
    }
    guatemala {
      id
      accountNumber
      bankAccountType
      fullName
      bank {
        id
        name
      }
    }
  }
`;
