import { MutationSendVerificationCodeArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function sendVerificationCode(
  parent,
  args: MutationSendVerificationCodeArgs,
  { dependencies }: IContext,
  info,
): Promise<boolean> {
  const userRepository = dependencies.provide(userRepositoryInjectionKey);
  return userRepository.sendVerificationCode(args);
}
