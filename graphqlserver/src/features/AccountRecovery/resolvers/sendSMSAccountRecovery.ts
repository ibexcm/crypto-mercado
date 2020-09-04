import { MutationSendSmsAccountRecoveryArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { accountRecoveryInjectioKey } from "../InjectionKeys";
import { createSecureCookieOptions } from "../util";

export async function sendSMSAccountRecovery(
  parent,
  args: MutationSendSmsAccountRecoveryArgs,
  { response, dependencies }: IContext,
  info,
): Promise<boolean> {
  try {
    const accountRecoveryRepository = dependencies.provide(accountRecoveryInjectioKey);
    const { token, smsSent } = await accountRecoveryRepository.sendSMSAccountRecovery(args);
    const cookieOptions = await createSecureCookieOptions();

    response.cookie("recovery", token, cookieOptions);
    return smsSent;
  } catch (error) {}
}
