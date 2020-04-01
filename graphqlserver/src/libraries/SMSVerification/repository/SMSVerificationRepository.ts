import Twilio from "twilio";
import config from "../../../config";
import { SMSVerificationError } from "../errors/SMSVerificationError";
import { ISMSVerificationRepository } from "../interfaces/ISMSVerificationRepository";

const { sid, aid, token } = config.get("twilio");

const { verify } = Twilio(aid, token);

const sendVerificationCode = async (number: string) => {
  try {
    const { status } = await verify
      .services(sid)
      .verifications.create({ to: number, channel: "sms" });
    return status === "pending";
  } catch (error) {
    switch (error.code) {
      case 60200:
        throw SMSVerificationError.invalidPhoneNumberError;
      case 60203:
        throw SMSVerificationError.maxAttemptsReachedError;
      default:
        throw error;
    }
  }
};

const verifyCode = async (number: string, code: string) => {
  const { status } = await verify
    .services(sid)
    .verificationChecks.create({ to: number, code });

  return status == "approved";
};

export const SMSVerificationRepository: ISMSVerificationRepository = {
  sendVerificationCode,
  verifyCode,
};
