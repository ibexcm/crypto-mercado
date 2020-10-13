import { LazyQueryResult, MutationResult, useLazyQuery, useMutation } from "@apollo/client";
import {
  Mutation,
  MutationResetPasswordArgs,
  Query,
  QueryRecoverAccountArgs,
} from "@ibexcm/libraries/api";
import {
  GetAccountRecoveryLinkQuery,
  ResetPasswordMutation,
} from "@ibexcm/libraries/api/accountRecovery";
import { isValidEmail, isValidPhoneNumber } from "@ibexcm/libraries/validation";
export class AccountRecoveryRepository {
  useGetAccountRecoveryLink(): {
    executeGetAccountRecoveryLink: (args: QueryRecoverAccountArgs) => Promise<void>;
    state: LazyQueryResult<Pick<Query, "recoverAccount">, QueryRecoverAccountArgs>;
  } {
    const [execute, state] = useLazyQuery<
      Pick<Query, "recoverAccount">,
      QueryRecoverAccountArgs
    >(GetAccountRecoveryLinkQuery);

    const executeGetAccountRecoveryLink = async (args: QueryRecoverAccountArgs) => {
      this.clearInvalidValues(args);
      await execute({ variables: args });
    };

    return {
      executeGetAccountRecoveryLink,
      state,
    };
  }

  useResetPasswordMutation(): {
    execute: (args: MutationResetPasswordArgs, token: string) => Promise<void>;
  } {
    const [execute] = useMutation(ResetPasswordMutation);

    return {
      execute: async (args, token) => {
        const {
          data,
          error,
        }: Partial<MutationResult<Pick<Mutation, "resetPassword">>> = await execute({
          variables: args,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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

  private clearInvalidValues(input: QueryRecoverAccountArgs): QueryRecoverAccountArgs {
    const {
      args: {
        emailRecovery: { address },
        smsRecovery: { number },
      },
    } = input;

    if (!isValidPhoneNumber(number)) {
      delete input.args.smsRecovery;
    } else if (!isValidEmail(address)) {
      delete input.args.emailRecovery;
    }

    return input;
  }
}
