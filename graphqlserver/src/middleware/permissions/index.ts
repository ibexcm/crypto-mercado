import { and, shield } from "graphql-shield";
import * as rules from "./rules";

export const permissions = shield({
  Query: {
    user: rules.isUser,
  },

  Mutation: {
    authenticate: and(rules.isKYCApproved, rules.isValidPassword, rules.usernameExists),
    sendPhoneNumberVerificationCode: rules.isPhoneNumberAvailable,
    verifyPhoneNumber: rules.isPhoneNumberAvailable,
    sendEmailVerificationCode: rules.isEmailAvailable,
    verifyEmail: rules.isEmailAvailable,
    setPassword: rules.isUser,
    uploadGovernmentID: rules.isUser,
    setBankAccount: rules.isUser,
  },
});
