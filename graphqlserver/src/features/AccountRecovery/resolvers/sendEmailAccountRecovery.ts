import { MutationSendEmailAccountRecoveryArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { accountRecoveryInjectioKey } from "../InjectionKeys";
import { createSecureCookieOptions } from "../util";

export async function sendEmailAccountRecovery(
  parent,
  args: MutationSendEmailAccountRecoveryArgs,
  { response, dependencies }: IContext,
  info,
) {
  try {
    const accountRecoveryRepository = dependencies.provide(accountRecoveryInjectioKey);
    const { token, emailSent } = await accountRecoveryRepository.sendEmailAccountRecovery(
      args,
    );
    const cookieOptions = await createSecureCookieOptions();

    response.cookie("recovery", token, cookieOptions);
    return emailSent;
  } catch (error) {}
}
