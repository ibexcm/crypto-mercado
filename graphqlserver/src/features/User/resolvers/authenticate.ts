import { MutationAuthenticateArgs, Session } from "@ziina/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function authenticate(
  parent,
  { username, password }: MutationAuthenticateArgs,
  { dependencies }: IContext,
  info,
): Promise<Session> {
  const userRepository = dependencies.provide(userRepositoryInjectionKey);
  return userRepository.authenticate(username, password);
}
