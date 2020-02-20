import { ApolloError } from "apollo-server-errors";

export enum UserErrorCode {
  usernameTaken = "usernameTaken",
  phoneNumberExists = "phoneNumberExists",
  verificationCode = "verificationCode",
  twillioSending = "twillioSending",
  invalidCredential = "invalidCredential",
  invalidUsername = "invalidUsername",
  unableToSetProfilePicture = "unableToSetProfilePicture",
}

const usernameTakenError = new ApolloError(
  "Username already taken",
  UserErrorCode.usernameTaken,
);

const invalidUsernameError = new ApolloError(
  "Username does not exist",
  UserErrorCode.invalidUsername,
);

const phoneNumberExistsError = new ApolloError(
  "Phone number already taken",
  UserErrorCode.phoneNumberExists,
);

const verificationCodeError = new ApolloError(
  "Verification code is not correct",
  UserErrorCode.verificationCode,
);

const twillioSendingError = new ApolloError(
  "Twillio verification code is failed",
  UserErrorCode.twillioSending,
);

const invalidCredentialError = new ApolloError(
  "Username or password is not correct",
  UserErrorCode.invalidCredential,
);

const unableToSetProfilePicture = (error: Error) => {
  return new ApolloError(
    `Unable to set profile picture: ${error.message}`,
    UserErrorCode.unableToSetProfilePicture,
  );
};

export const UserError = {
  usernameTakenError,
  phoneNumberExistsError,
  verificationCodeError,
  twillioSendingError,
  invalidCredentialError,
  invalidUsernameError,
  unableToSetProfilePicture,
};
