import gql from "graphql-tag";
import { Transaction } from "../transaction/fragments";
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
      transactions(orderBy: createdAt_DESC) {
        ...Transaction
      }
    }
  }
  ${UserRole}
  ${Account}
  ${Contact}
  ${Profile}
  ${BankAccounts}
  ${CryptoAccounts}
  ${Transaction}
`;
