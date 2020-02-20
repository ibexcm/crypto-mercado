import { MutationSetFullNameArgs } from "@ziina/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function setFullName(
  parent,
  { fullName }: MutationSetFullNameArgs,
  { dependencies, request }: IContext,
  info,
): Promise<boolean> {
  const userRepository = dependencies.provide(userRepositoryInjectionKey);
  return await userRepository.setFullName(fullName, request.auth.account);
}
