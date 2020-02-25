import {
  sendEmailVerificationCode,
  sendPhoneNumberVerificationCode,
  verifyEmail,
  verifyPhoneNumber,
} from "../../features/User/resolvers";

export const Mutation = {
  verifyPhoneNumber,
  sendPhoneNumberVerificationCode,
  verifyEmail,
  sendEmailVerificationCode,
};
