import { MutationAdminAuthenticateArgs, Session } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { authenticationRepositoryInjectionKey } from "../InjectionKeys";

export async function adminAuthenticate(
  parent,
  args: MutationAdminAuthenticateArgs,
  { dependencies }: IContext,
  info,
): Promise<Session> {
  const AuthenticationRepository = dependencies.provide(
    authenticationRepositoryInjectionKey,
  );
  return await AuthenticationRepository.adminAuthenticate(args);
}
