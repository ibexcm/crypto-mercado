import { MutationAuthenticateArgs, Session } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { authenticationRepositoryInjectionKey } from "../InjectionKeys";

export async function authenticate(
  parent,
  args: MutationAuthenticateArgs,
  { dependencies }: IContext,
  info,
): Promise<Session> {
  const AuthenticationRepository = dependencies.provide(
    authenticationRepositoryInjectionKey,
  );
  return await AuthenticationRepository.authenticate(args);
}
