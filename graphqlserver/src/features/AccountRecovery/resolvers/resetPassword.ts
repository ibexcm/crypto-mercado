import { MutationResetPasswordArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { accountRecoveryInjectioKey } from "../InjectionKeys";

export async function resetPassword(
  parent,
  args: MutationResetPasswordArgs,
  { dependencies, request }: IContext,
  info,
) {
  try {
    const accountRecoveryRepository = dependencies.provide(accountRecoveryInjectioKey);
    return await accountRecoveryRepository.resetPassword(
      args,
      request.query.authToken.user,
    );
  } catch (error) {}
}
