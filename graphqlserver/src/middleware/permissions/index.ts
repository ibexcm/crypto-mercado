import { and, shield } from "graphql-shield";
import * as rules from "./rules";

export const permissions = shield({
  Query: {
    user: rules.isUser,

    // ADMIN
    // KYC
    adminGetUsersWithPendingKYCApproval: rules.isAdmin,

    // USER
    adminGetUser: rules.isAdmin,
  },

  Mutation: {
    // ADMIN
    adminAuthenticate: rules.isValidAdminAuthentication,
    // KYC
    adminKYCApproveUser: rules.isAdmin,
    adminKYCRejectUser: rules.isAdmin,

    authenticate: and(rules.usernameExists, rules.isValidPassword, rules.isKYCApproved),
    sendPhoneNumberVerificationCode: rules.isPhoneNumberAvailable,
    verifyPhoneNumber: rules.isPhoneNumberAvailable,
    sendEmailVerificationCode: rules.isEmailAvailable,
    verifyEmail: rules.isEmailAvailable,
    setPassword: rules.isUser,
    uploadGovernmentID: rules.isUser,
    setBankAccount: rules.isUser,
  },
});
