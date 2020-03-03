import {
  sendEmailVerificationCode,
  sendPhoneNumberVerificationCode,
  setPassword,
  verifyEmail,
  verifyPhoneNumber,
} from "../../features/User/resolvers";

export const Mutation = {
  verifyPhoneNumber,
  sendPhoneNumberVerificationCode,
  verifyEmail,
  sendEmailVerificationCode,
  setPassword,
};
