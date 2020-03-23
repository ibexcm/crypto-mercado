import { ApolloError } from "apollo-server-errors";

export enum AuthenticationErrorCode {
  invalidUsername = "invalidUsername",
  invalidPassword = "invalidPassword",
  invalidBankAccount = "invalidBankAccount",
  invalidProfileDocument = "invalidProfileDocument",
}

const invalidUsernameError = new ApolloError(
  "Username does not exist",
  AuthenticationErrorCode.invalidUsername,
);

const invalidPasswordError = new ApolloError(
  "Invalid password",
  AuthenticationErrorCode.invalidPassword,
);

const invalidBankAccountError = new ApolloError(
  "Invalid bank account",
  AuthenticationErrorCode.invalidBankAccount,
);

const invalidProfileDocumentError = new ApolloError(
  "Invalid profile document",
  AuthenticationErrorCode.invalidProfileDocument,
);

export const AuthenticationError = {
  invalidUsernameError,
  invalidPasswordError,
  invalidBankAccountError,
  invalidProfileDocumentError,
};
