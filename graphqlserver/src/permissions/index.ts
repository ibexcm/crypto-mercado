import { inputRule, shield } from "graphql-shield";
import * as rules from "./rules";

export const permissions = shield({
  Query: {
    user: rules.isUser,
  },

  Mutation: {
    authenticate: inputRule(yup =>
      yup.object({
        username: yup
          .string()
          .min(3)
          .required("Username must be of at least 3 characters"),
        password: yup.string().required("Password is required"),
      }),
    ),
    sendVerificationCode: rules.isPhoneNumberAvailable,
    verifyPhoneNumber: rules.isPhoneNumberAvailable,
  },
});
