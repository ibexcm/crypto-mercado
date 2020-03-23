import { sendEmailVerificationCode } from "./sendEmailVerificationCode";
import { sendPhoneNumberVerificationCode } from "./sendPhoneNumberVerificationCode";
import { setBankAccount } from "./setBankAccount";
import { setPassword } from "./setPassword";
import { uploadGovernmentID } from "./uploadGovernmentID";
import { verifyEmail } from "./verifyEmail";
import { verifyPhoneNumber } from "./verifyPhoneNumber";

export const mutations = {
  verifyPhoneNumber,
  sendPhoneNumberVerificationCode,
  verifyEmail,
  sendEmailVerificationCode,
  setPassword,
  uploadGovernmentID,
  setBankAccount,
};
