import { MutationResult, useMutation, useQuery } from "@apollo/client";
import { Query } from "@ibexcm/libraries/api";
import {
  AdminGetUsersWithPendingKYCApprovalQuery,
  AdminKYCApproveUserMutation,
} from "@ibexcm/libraries/api/kyc";
import { Mutation, MutationAdminKycApproveUserArgs } from "../../../libraries/api";

export class KYCRepository {
  useAdminGetUsersWithPendingKYCApprovalQuery() {
    return useQuery<Pick<Query, "adminGetUsersWithPendingKYCApproval">>(
      AdminGetUsersWithPendingKYCApprovalQuery,
      {
        fetchPolicy: "cache-and-network",
      },
    );
  }

  useAdminKYCApproveUserMutation(): {
    execute: (args: MutationAdminKycApproveUserArgs) => Promise<void>;
    loading: boolean;
  } {
    const [execute, { loading }] = useMutation(AdminKYCApproveUserMutation);

    return {
      execute: async args => {
        const message = "Falló la aprobación de este usuario.";
        try {
          const {
            data,
            error,
          }: Partial<MutationResult<Pick<Mutation, "adminKYCApproveUser">>> = await execute(
            {
              variables: args,
            },
          );

          if (Boolean(error) || !Boolean(data?.adminKYCApproveUser)) {
            throw new Error(message);
          }

          const { adminKYCApproveUser } = data as Pick<Mutation, "adminKYCApproveUser">;

          if (!adminKYCApproveUser) {
            throw new Error(message);
          }
        } catch (error) {
          throw new Error(message);
        }
      },
      loading,
    };
  }
}
