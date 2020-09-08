import { QueryRecoverAccountArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { accountRecoveryInjectioKey } from "../InjectionKeys";
export async function recoverAccount(
  parent,
  args: QueryRecoverAccountArgs,
  { dependencies }: IContext,
  info,
) {
  try {
    const accountRecoveryRepository = dependencies.provide(accountRecoveryInjectioKey);
    return await accountRecoveryRepository.recoverAccount(args);
  } catch (error) {}
}
