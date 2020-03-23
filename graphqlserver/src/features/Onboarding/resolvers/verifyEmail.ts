import { MutationVerifyEmailArgs, Session } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { onboardingRepositoryInjectionKey } from "../InjectionKeys";

export async function verifyEmail(
  parent,
  args: MutationVerifyEmailArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Session> {
  const userRepository = dependencies.provide(onboardingRepositoryInjectionKey);
  return await userRepository.verifyEmail(args, request.auth.user);
}
