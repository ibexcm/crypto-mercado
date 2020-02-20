import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";
import { MutationSendVerificationCodeArgs } from "@ziina/libraries/api";

export async function sendVerificationCode(
  parent,
  { number }: MutationSendVerificationCodeArgs,
  { dependencies }: IContext,
  info,
): Promise<boolean> {
  const userRepository = dependencies.provide(userRepositoryInjectionKey);
  return userRepository.sendVerificationCode(number);
}
