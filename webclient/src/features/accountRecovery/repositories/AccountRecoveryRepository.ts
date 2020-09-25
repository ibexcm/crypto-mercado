import { LazyQueryResult, MutationResult, useLazyQuery, useMutation } from "@apollo/client";
import {
  Mutation,
  MutationResetPasswordArgs,
  Query,
  QueryRecoverAccountArgs,
} from "@ibexcm/libraries/api";
import {
  GetAccountRecoveryLink,
  ResetPasswordMutation,
} from "@ibexcm/libraries/api/accountRecovery";

export class AccountRecoveryRepository {
  constructor() {}

  useGetAccountRecoveryLink(): {
    executeGetAccountRecoveryLink: (args: QueryRecoverAccountArgs) => Promise<void>;
    state: LazyQueryResult<Pick<Query, "recoverAccount">, QueryRecoverAccountArgs>;
  } {
    const [execute, state] = useLazyQuery<
      Pick<Query, "recoverAccount">,
      QueryRecoverAccountArgs
    >(GetAccountRecoveryLink);

    const executeGetAccountRecoveryLink = async (args: QueryRecoverAccountArgs) => {
      execute({ variables: args });

      if (Boolean(state?.error)) {
        throw new Error(state.error.message);
      }
    };

    return {
      executeGetAccountRecoveryLink,
      state,
    };
  }

  useResetPasswordMutation(): {
    execute: (args: MutationResetPasswordArgs) => Promise<void>;
  } {
    const [execute] = useMutation(ResetPasswordMutation);

    return {
      execute: async (args) => {
        const {
          data,
          error,
        }: Partial<MutationResult<Pick<Mutation, "resetPassword">>> = await execute({
          variables: args,
        });

        if (Boolean(error)) {
          throw error;
        }

        if (!Boolean(data?.resetPassword)) {
          throw new Error("No pudimos restablecer tu contraseña");
        }
      },
    };
  }
}
