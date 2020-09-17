import {
  LazyQueryResult,
  MutationResult,
  QueryResult,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import {
  QueryRecoverAccountArgs,
  Query,
  MutationResetPasswordArgs,
  Mutation,
} from "@ibexcm/libraries/api";
import {
  GetAccountRecoveryLink,
  ResetPasswordMutation,
} from "@ibexcm/libraries/api/accountRecovery";
import { AuthTokenRepository } from "../../authentication/repositories/AuthTokenRepository";

export class AccountRecoveryRepository {
  private AuthTokenRepository: AuthTokenRepository;

  constructor(AuthTokenRepository: AuthTokenRepository) {
    this.AuthTokenRepository = AuthTokenRepository;
  }

  useGetAccountRecoveryLink(): [
    (args: QueryRecoverAccountArgs) => Promise<void>,
    LazyQueryResult<Pick<Query, "recoverAccount">, QueryRecoverAccountArgs>,
  ] {
    const [execute, state] = useLazyQuery<
      Pick<Query, "recoverAccount">,
      QueryRecoverAccountArgs
    >(GetAccountRecoveryLink);

    const executeGetAccountRecoveryLink = async (args: QueryRecoverAccountArgs) => {
      execute({ variables: args });

      if (Boolean(state?.error)) {
        throw new Error(state.error.name);
      }

      const {
        recoverAccount: { token },
      } = state.data;
      this.AuthTokenRepository.setAuthToken(token as string);
    };

    return [executeGetAccountRecoveryLink, state];
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
