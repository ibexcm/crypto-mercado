import { MutationResult, useMutation, useQuery } from "@apollo/client";
import {
  Mutation,
  MutationAdminDeleteUserArgs,
  MutationAdminKycApproveUserArgs,
  Query,
} from "@ibexcm/libraries/api";
import {
  AdminGetUsersWithPendingKYCApprovalQuery,
  AdminKYCApproveUserMutation,
} from "@ibexcm/libraries/api/kyc";
import { AdminDeleteUserMutation, AdminGetUsersQuery } from "@ibexcm/libraries/api/user";

export class KYCRepository {
  useAdminGetUsersWithPendingKYCApprovalQuery() {
    return useQuery<Pick<Query, "adminGetUsersWithPendingKYCApproval">>(
      AdminGetUsersWithPendingKYCApprovalQuery,
      {
        fetchPolicy: "cache-and-network",
      },
    );
  }

  useAdminGetUsersQuery() {
    return useQuery<Pick<Query, "adminGetUsers">>(AdminGetUsersQuery, {
      fetchPolicy: "cache-and-network",
    });
  }

  useAdminDeleteUserMutation(): {
    execute: (args: MutationAdminDeleteUserArgs) => Promise<void>;
    loading: boolean;
  } {
    const [execute, { loading }] = useMutation(AdminDeleteUserMutation);

    return {
      execute: async (args) => {
        const message = "No se ha podido borrar este usuario este usuario.";
        try {
          const {
            data,
            error,
          }: Partial<MutationResult<Pick<Mutation, "adminDeleteUser">>> = await execute({
            variables: args,
          });

          if (Boolean(error) || !Boolean(data?.adminDeleteUser)) {
            throw new Error(message);
          }

          const { adminDeleteUser } = data as Pick<Mutation, "adminDeleteUser">;

          if (!adminDeleteUser) {
            throw new Error(message);
          }
        } catch (error) {
          throw new Error(message);
        }
      },
      loading,
    };
  }

  useAdminKYCApproveUserMutation(): {
    execute: (args: MutationAdminKycApproveUserArgs) => Promise<void>;
    loading: boolean;
  } {
    const [execute, { loading }] = useMutation(AdminKYCApproveUserMutation);

    return {
      execute: async (args) => {
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
