import gql from "graphql-tag";
import { Account, BankAccounts, Contact, Profile, UserRole } from "../user/fragments";

export const AdminGetUsersWithPendingKYCApprovalQuery = gql`
  query AdminGetUsersWithPendingKYCApprovalQuery {
    adminGetUsersWithPendingKYCApproval {
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
