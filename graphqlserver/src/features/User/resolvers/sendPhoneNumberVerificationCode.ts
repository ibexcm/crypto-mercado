import { MutationSendPhoneNumberVerificationCodeArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function sendPhoneNumberVerificationCode(
  parent,
  args: MutationSendPhoneNumberVerificationCodeArgs,
  { dependencies }: IContext,
  info,
): Promise<boolean> {
  const userRepository = dependencies.provide(userRepositoryInjectionKey);
  return userRepository.sendPhoneNumberVerificationCode(args);
}
