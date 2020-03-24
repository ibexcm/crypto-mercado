import { useQuery } from "@apollo/client";
import { Query } from "@ibexcm/libraries/api";
import { AdminGetUsersWithPendingKYCApprovalQuery } from "@ibexcm/libraries/api/kyc";

export class KYCRepository {
  useAdminGetUsersWithPendingKYCApprovalQuery() {
    return useQuery<Pick<Query, "adminGetUsersWithPendingKYCApproval">>(
      AdminGetUsersWithPendingKYCApprovalQuery,
      {
        fetchPolicy: "cache-and-network",
      },
    );
  }
}
