import gql from "graphql-tag";
import { Account, BankAccounts, Contact, Profile, UserRole } from "./fragments";

export const AdminGetUsersQuery = gql`
  query AdminGetUsersQuery {
    adminGetUsers {
      id
      ...UserRole
      account {
        ...Account
      }
      contact {
        ...Contact
      }
      ...Profile
      bankAccounts {
        ...BankAccounts
      }
    }
  }
  ${UserRole}
  ${Account}
  ${Contact}
  ${Profile}
  ${BankAccounts}
`;
