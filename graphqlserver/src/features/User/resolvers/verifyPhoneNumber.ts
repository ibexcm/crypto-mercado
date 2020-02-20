import { MutationVerifyPhoneNumberArgs, Session } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function verifyPhoneNumber(
  parent,
  args: MutationVerifyPhoneNumberArgs,
  { dependencies }: IContext,
  info,
): Promise<Session> {
  const userRepository = dependencies.provide(userRepositoryInjectionKey);
  return await userRepository.verifyPhoneNumber(args);
}
