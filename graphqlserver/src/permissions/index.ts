import { and, inputRule, shield } from "graphql-shield";
import * as rules from "./rules";

export const permissions = shield({
  Query: {
    user: rules.isUser,
    getBankAccounts: rules.isUser,
  },

  Mutation: {
    createUser: and(
      inputRule(yup =>
        yup.object({
          username: yup
            .string()
            .required("Username must be of at least 3 characters")
            .min(3),
          password: yup.string().required("Password is required"),
        }),
      ),
      rules.isAccount,
    ),
    authenticate: inputRule(yup =>
      yup.object({
        username: yup
          .string()
          .min(3)
          .required("Username must be of at least 3 characters"),
        password: yup.string().required("Password is required"),
      }),
    ),
    setFullName: rules.isAccount,
    sendVerificationCode: rules.isPhoneNumberAvailable,
    verifyPhoneNumber: rules.isPhoneNumberAvailable,
    setProfilePicture: rules.isUser,
  },
});
