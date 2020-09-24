import { ApolloError } from "apollo-server-errors";

enum SMSAccountRecoveryErrorCode {
  invalidPhoneNumber = "invalidPhoneNumber",
  maxAttemptsReached = "maxAttemptsReached",
}

const invalidPhoneNumberError = new ApolloError(
  "Invalid phone number",
  SMSAccountRecoveryErrorCode.invalidPhoneNumber,
);

const maxAttemptsReachedError = new ApolloError(
  "Max attempts reached",
  SMSAccountRecoveryErrorCode.maxAttemptsReached,
);

export const SMSAccountRecoveryError = {
  invalidPhoneNumberError,
  maxAttemptsReachedError,
};
