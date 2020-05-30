import gql from "graphql-tag";
import { Account, BankAccounts, Contact, Profile, UserRole } from "../user/fragments";

export const AdminGetUsersWithPendingKYCApprovalQuery = gql`
  query AdminGetUsersWithPendingKYCApprovalQuery {
    adminGetUsersWithPendingKYCApproval {
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
