import { ApolloError } from "apollo-server-errors";

enum EmailVerificationErrorCode {
  invalidPhoneNumber = "invalidPhoneNumber",
  maxAttemptsReached = "maxAttemptsReached",
}

const invalidEmailAddressError = new ApolloError(
  "Invalid email address",
  EmailVerificationErrorCode.invalidPhoneNumber,
);

const maxAttemptsReachedError = new ApolloError(
  "Max attempts reached",
  EmailVerificationErrorCode.maxAttemptsReached,
);

export const SMSVerificationError = {
  invalidEmailAddressError,
  maxAttemptsReachedError,
};
