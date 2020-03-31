import Twilio from "twilio";
import config from "../../../config";
import { EmailVerificationError } from "../errors/EmailVerificationError";
import { IEmailVerificationRepository } from "../interfaces/IEmailVerificationRepository";

const { sid, aid, token } = config.get("twilio");
const { host } = config.get("email");
const { verify } = Twilio(aid, token);

const sendVerificationCode = async (address: string) => {
  try {
    const { status } = await verify.services(sid).verifications.create({
      channelConfiguration: {
        template_id: "d-bf4436bd60e749bba4b1fd521675155e",
        from: "soporte@ibexcm.com",
        from_name: "IBEX Mercado",
        substitutions: {
          url: `${host}/verifica-tu-correo?a=${address}`,
        },
      },
      to: address,
      channel: "email",
    });
    return status === "pending";
  } catch (error) {
    switch (error.code) {
      case 60200:
        throw EmailVerificationError.invalidEmailAddressError;
      case 60203:
        throw EmailVerificationError.maxAttemptsReachedError;
      default:
        throw error;
    }
  }
};

const verifyCode = async (address: string, code: string) => {
  const { status } = await verify
    .services(sid)
    .verificationChecks.create({ to: address, code });
  return status == "approved";
};

export const EmailVerificationRepository: IEmailVerificationRepository = {
  sendVerificationCode,
  verifyCode,
};
