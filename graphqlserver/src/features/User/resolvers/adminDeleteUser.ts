import { User } from "@ibexcm/database";
import { MutationAdminDeleteUserArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function adminDeleteUser(
  parent,
  args: MutationAdminDeleteUserArgs,
  { dependencies, request }: IContext,
  info,
): Promise<User> {
  const UserRepository = dependencies.provide(userRepositoryInjectionKey);
  return await UserRepository.adminDeleteUser(args);
}
