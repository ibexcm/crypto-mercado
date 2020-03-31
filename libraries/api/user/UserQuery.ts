import gql from "graphql-tag";
import {
  Account,
  BankAccounts,
  Contact,
  CryptoAccounts,
  Profile,
  UserRole,
} from "./fragments";

export const UserQuery = gql`
  query UserQuery {
    user {
      id
      ...UserRole
      ...Account
      ...Contact
      ...Profile
      ...BankAccounts
      ...CryptoAccounts
    }
  }
  ${UserRole}
  ${Account}
  ${Contact}
  ${Profile}
  ${BankAccounts}
  ${CryptoAccounts}
`;
