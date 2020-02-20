import { MutationCreateUserArgs, Session } from "@ziina/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function createUser(
  parent,
  { username, password }: MutationCreateUserArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Session> {
  const userRepository = dependencies.provide(userRepositoryInjectionKey);
  return userRepository.createUser(username, password, request.auth.account);
}
