import gql from "graphql-tag";

export const AdminKYCRejectUserMutation = gql`
  mutation AdminKYCRejectUserMutation(
    $userArgs: AdminKYCRejectUserInput!
    $rejectArgs: AdminKYCRejectUserInput!
  ) {
    adminKYCRejectUser(userArgs: $userArgs, rejectArgs: $rejectArgs)
  }
`;
