import { ApolloError } from "apollo-server-errors";

enum EmailVerificationErrorCode {
  invalidEmailAddress = "invalidEmailAddress",
  maxAttemptsReached = "maxAttemptsReached",
}

const invalidEmailAddressError = new ApolloError(
  "Invalid email address",
  EmailVerificationErrorCode.invalidEmailAddress,
);

const maxAttemptsReachedError = new ApolloError(
  "Max attempts reached",
  EmailVerificationErrorCode.maxAttemptsReached,
);

export const EmailVerificationError = {
  invalidEmailAddressError,
  maxAttemptsReachedError,
};
