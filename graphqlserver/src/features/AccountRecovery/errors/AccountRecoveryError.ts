import { ApolloError } from "apollo-server-errors";

export enum AccountRecoveryErrorCode {
  invalidPassword = "invalidPassword",
  unregisteredEmail = "unregisteredEmail",
  unauthorized = "unauthorized",
  unregisteredPhoneNumber = "unregisteredPhoneNumber",
  invalidPhoneNumber = "invalidPhoneNumber",
  invalidEmailAddress = "invalidEmailAddress",
  unregisteredUser = "unregisteredUser",
}

const invalidPasswordError = new ApolloError(
  "Invalid Password",
  AccountRecoveryErrorCode.invalidPassword,
);

const unregisteredEmailError = new ApolloError(
  "Email is not registered",
  AccountRecoveryErrorCode.unregisteredEmail,
);

const unregisteredPhoneNumber = new ApolloError(
  "Phone Number is not registered",
  AccountRecoveryErrorCode.unregisteredPhoneNumber,
);

const unauthorizedError = new ApolloError(
  "Unauthorized Request",
  AccountRecoveryErrorCode.unauthorized,
);

const invalidPhoneNumberError = new ApolloError(
  "Invalid Phone Number",
  AccountRecoveryErrorCode.invalidPhoneNumber,
);

const invalidEmailAddressError = new ApolloError(
  "Invalid Email Address",
  AccountRecoveryErrorCode.invalidEmailAddress,
);

const unregisteredUserError = new ApolloError(
  "User is not registered",
  AccountRecoveryErrorCode.unregisteredUser,
);

export const AccountRecoveryError = {
  invalidPasswordError,
  unauthorizedError,
  unregisteredEmailError,
  unregisteredPhoneNumber,
  unregisteredUserError,
  invalidPhoneNumberError,
  invalidEmailAddressError,
};
