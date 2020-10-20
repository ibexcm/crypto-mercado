import { User } from "@ibexcm/database";
import { QueryAdminGetUserArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function adminGetUsers(
  parent,
  args: QueryAdminGetUserArgs,
  { dependencies, request }: IContext,
  info,
): Promise<User[]> {
  const UserRepository = dependencies.provide(userRepositoryInjectionKey);
  return await UserRepository.adminGetUsers();
}
