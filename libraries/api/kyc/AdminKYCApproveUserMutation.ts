import gql from "graphql-tag";

export const AdminKYCApproveUserMutation = gql`
  mutation AdminKYCApproveUserMutation(
    $userArgs: AdminKYCApproveUserInput!
    $governmentIDArgs: AdminKYCApproveUserGovernmentIDInput!
    $bankAccountArgs: AdminKYCApproveUserBankAccountInput!
  ) {
    adminKYCApproveUser(
      userArgs: $userArgs
      governmentIDArgs: $governmentIDArgs
      bankAccountArgs: $bankAccountArgs
    )
  }
`;
