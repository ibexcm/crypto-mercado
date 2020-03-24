import { User } from "@ibexcm/database";
import { QueryAdminGetUserArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function adminGetUser(
  parent,
  args: QueryAdminGetUserArgs,
  { dependencies, request }: IContext,
  info,
): Promise<User> {
  const KYCRepository = dependencies.provide(userRepositoryInjectionKey);
  return await KYCRepository.adminGetUser(args);
}
