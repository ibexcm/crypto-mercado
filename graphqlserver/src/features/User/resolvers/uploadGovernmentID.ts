import { MutationUploadGovernmentIdArgs, Session } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function uploadGovernmentID(
  parent,
  args: MutationUploadGovernmentIdArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Session> {
  const userRepository = dependencies.provide(userRepositoryInjectionKey);
  return await userRepository.uploadGovernmentID(args, request.auth.user);
}
