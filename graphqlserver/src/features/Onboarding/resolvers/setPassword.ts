import { MutationSetPasswordArgs, Session } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { onboardingRepositoryInjectionKey } from "../InjectionKeys";

export async function setPassword(
  parent,
  args: MutationSetPasswordArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Session> {
  const userRepository = dependencies.provide(onboardingRepositoryInjectionKey);
  return await userRepository.setPassword(args, request.auth.user);
}
