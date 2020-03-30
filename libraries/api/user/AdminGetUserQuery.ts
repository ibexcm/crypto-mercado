import gql from "graphql-tag";
import { Account, BankAccounts, Contact, Profile, UserRole } from "./fragments";

export const AdminGetUserQuery = gql`
  query AdminGetUserQuery($args: AdminGetUserInput!) {
    adminGetUser(args: $args) {
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