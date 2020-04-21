import { ApolloError } from "apollo-server-errors";

enum SMSVerificationErrorCode {
  invalidPhoneNumber = "invalidPhoneNumber",
  maxAttemptsReached = "maxAttemptsReached",
}

const invalidPhoneNumberError = new ApolloError(
  "Invalid phone number",
  SMSVerificationErrorCode.invalidPhoneNumber,
);

const maxAttemptsReachedError = new ApolloError(
  "Max attempts reached",
  SMSVerificationErrorCode.maxAttemptsReached,
);

export const SMSVerificationError = {
  invalidPhoneNumberError,
  maxAttemptsReachedError,
};
