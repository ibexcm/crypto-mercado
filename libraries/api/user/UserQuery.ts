import gql from "graphql-tag";
import { Account, BankAccounts, Contact, Profile, UserRole } from "./fragments";

export const UserQuery = gql`
  query UserQuery {
    user {
      id
      ...UserRole
      ...Account
      ...Contact
      ...Profile
      ...BankAccounts
    }
  }
  ${UserRole}
  ${Account}
  ${Contact}
  ${Profile}
  ${BankAccounts}
`;
