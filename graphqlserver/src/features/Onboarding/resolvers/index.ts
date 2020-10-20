import { sendEmailVerificationCode } from "./sendEmailVerificationCode";
import { setBankAccount } from "./setBankAccount";
import { setPassword } from "./setPassword";
import { uploadGovernmentID } from "./uploadGovernmentID";
import { verifyEmail } from "./verifyEmail";

export const mutations = {
  verifyEmail,
  sendEmailVerificationCode,
  setPassword,
  uploadGovernmentID,
  setBankAccount,
};
