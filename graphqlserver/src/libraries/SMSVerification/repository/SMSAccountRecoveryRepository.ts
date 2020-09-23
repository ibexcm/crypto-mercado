import Twilio from "twilio";
import config from "../../../config";
import { SMSAccountRecoveryError } from "../errors";
import { ISMSAccountRecoveryRepository } from "../interfaces";

const { aid, token } = config.get("twilio");
const { messages } = Twilio(aid, token);

const sendRecoveryLink: ISMSAccountRecoveryRepository["sendRecoveryLink"] = async (
  to: string,
  from: string,
  host: string,
  { token },
) => {
  try {
    const { status } = await messages.create({
      to,
      from,
      body: `Recupera tu contraseña con este enlace: ${host}/restablecer-contrasena?t=${token}`,
    });

    return status === "sent";
  } catch (error) {
    switch (error.code) {
      case 60200:
        throw SMSAccountRecoveryError.invalidPhoneNumberError;
      case 60203:
        throw SMSAccountRecoveryError.maxAttemptsReachedError;
      default:
        throw error;
    }
  }
};

export const SMSAccountRecoveryRepository: ISMSAccountRecoveryRepository = {
  sendRecoveryLink,
};
