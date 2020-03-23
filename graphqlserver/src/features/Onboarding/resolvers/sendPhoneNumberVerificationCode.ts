import { MutationSendPhoneNumberVerificationCodeArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { onboardingRepositoryInjectionKey } from "../InjectionKeys";

export async function sendPhoneNumberVerificationCode(
  parent,
  args: MutationSendPhoneNumberVerificationCodeArgs,
  { dependencies }: IContext,
  info,
): Promise<boolean> {
  const userRepository = dependencies.provide(onboardingRepositoryInjectionKey);
  return userRepository.sendPhoneNumberVerificationCode(args);
}
