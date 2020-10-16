import { Session, MutationSendEmailVerificationCodeArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { onboardingRepositoryInjectionKey } from "../InjectionKeys";

export async function sendEmailVerificationCode(
  parent,
  args: MutationSendEmailVerificationCodeArgs,
  { dependencies }: IContext,
  info,
): Promise<Session> {
  const userRepository = dependencies.provide(onboardingRepositoryInjectionKey);
  return userRepository.sendEmailVerificationCode(args);
}
