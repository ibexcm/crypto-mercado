import { MutationVerifyPhoneNumberArgs, Session } from "@ziina/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export async function verifyPhoneNumber(
  parent,
  { number, code }: MutationVerifyPhoneNumberArgs,
  { dependencies }: IContext,
  info,
): Promise<Session> {
  const userRepository = dependencies.provide(userRepositoryInjectionKey);
  return await userRepository.verifyPhoneNumber(number, code);
}
