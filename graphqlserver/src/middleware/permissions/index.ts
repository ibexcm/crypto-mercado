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
    // AUTH
    authenticate: and(rules.usernameExists, rules.isValidPassword, rules.isKYCApproved),

    // ONBOARDING
    sendPhoneNumberVerificationCode: rules.isPhoneNumberAvailable,
    verifyPhoneNumber: rules.isPhoneNumberAvailable,
    sendEmailVerificationCode: rules.isEmailAvailable,
    verifyEmail: rules.isEmailAvailable,
    setPassword: rules.isUser,
    uploadGovernmentID: rules.isUser,
    setBankAccount: rules.isUser,

    // TRANSACTION
    createTransaction: and(rules.isUser, rules.isKYCApproved),

    // CRYPTO ACCOUNTS
    createBitcoinAccount: and(rules.isUser, rules.isKYCApproved),

    // ADMIN
    // AUTH
    adminAuthenticate: rules.isValidAdminAuthentication,
    // KYC
    adminKYCApproveUser: rules.isAdmin,
    adminKYCRejectUser: rules.isAdmin,
  },
});
