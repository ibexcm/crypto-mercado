import { MutationSendEmailVerificationCodeArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { onboardingRepositoryInjectionKey } from "../InjectionKeys";

export async function sendEmailVerificationCode(
  parent,
  args: MutationSendEmailVerificationCodeArgs,
  { dependencies, request }: IContext,
  info,
): Promise<boolean> {
  const userRepository = dependencies.provide(onboardingRepositoryInjectionKey);
  return userRepository.sendEmailVerificationCode(args, request.auth.user);
}
