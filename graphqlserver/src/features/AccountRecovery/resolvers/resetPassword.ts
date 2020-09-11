import { MutationResetPasswordArgs, Session } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { accountRecoveryInjectioKey } from "../InjectionKeys";

export async function resetPassword(
  parent,
  args: MutationResetPasswordArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Session> {
  try {
    const accountRecoveryRepository = dependencies.provide(accountRecoveryInjectioKey);
    return await accountRecoveryRepository.resetPassword(args, request.auth.user);
  } catch (error) {}
}
