import { LazyQueryResult, MutationResult, useLazyQuery, useMutation } from "@apollo/client";
import { QueryRecoverAccountArgs, Query } from "@ibexcm/libraries/api";
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
    (token: any) => Promise<void>,
  ] {
    const [execute, state] = useLazyQuery<
      Pick<Query, "recoverAccount">,
      QueryRecoverAccountArgs
    >(GetAccountRecoveryLink);

    const executeGetAccountRecoveryLink = async (args: QueryRecoverAccountArgs) =>
      execute({ variables: args });

    const setAuthToken = async (token: any) => {
      this.AuthTokenRepository.setAuthToken(token as string);
    };

    return [executeGetAccountRecoveryLink, state, setAuthToken];
  }
}
