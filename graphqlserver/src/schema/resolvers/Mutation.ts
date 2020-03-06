import {
  sendEmailVerificationCode,
  sendPhoneNumberVerificationCode,
  setPassword,
  uploadGovernmentID,
  verifyEmail,
  verifyPhoneNumber,
} from "../../features/User/resolvers";

export const Mutation = {
  verifyPhoneNumber,
  sendPhoneNumberVerificationCode,
  verifyEmail,
  sendEmailVerificationCode,
  setPassword,
  uploadGovernmentID,
};
