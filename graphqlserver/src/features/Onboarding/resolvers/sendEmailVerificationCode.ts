import { MutationSendEmailVerificationCodeArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function sendEmailVerificationCode(
  parent,
  args: MutationSendEmailVerificationCodeArgs,
  { dependencies }: IContext,
  info,
): Promise<boolean> {
  const userRepository = dependencies.provide(userRepositoryInjectionKey);
  return userRepository.sendEmailVerificationCode(args);
}
