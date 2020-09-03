import { MutationSendEmailAccountRecoveryArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { accountRecoveryInjectioKey } from "../InjectionKeys";
import { createCookie } from "../util";

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
    const cookieOptions = await createCookie();

    response.cookie("auth", token, cookieOptions);
    return emailSent;
  } catch (error) {}
}
