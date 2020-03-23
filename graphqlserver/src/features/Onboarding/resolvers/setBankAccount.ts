import { MutationSetBankAccountArgs, Session } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { onboardingRepositoryInjectionKey } from "../InjectionKeys";

export async function setBankAccount(
  parent,
  args: MutationSetBankAccountArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Session> {
  const userRepository = dependencies.provide(onboardingRepositoryInjectionKey);
  return await userRepository.setBankAccount(args, request.auth.user);
}
