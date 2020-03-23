import { MutationUploadGovernmentIdArgs, Session } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { onboardingRepositoryInjectionKey } from "../InjectionKeys";

export async function uploadGovernmentID(
  parent,
  args: MutationUploadGovernmentIdArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Session> {
  const userRepository = dependencies.provide(onboardingRepositoryInjectionKey);
  return await userRepository.uploadGovernmentID(args, request.auth.user);
}
