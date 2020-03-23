import { ApolloError } from "apollo-server-errors";

export enum OnboardingErrorCode {
  usernameTaken = "usernameTaken",
  phoneNumberExists = "phoneNumberExists",
  emailExists = "emailExists",
  verificationCode = "verificationCode",
  twillioSending = "twillioSending",
  invalidCredential = "invalidCredential",
  invalidUsername = "invalidUsername",
  unableToSetProfilePicture = "unableToSetProfilePicture",
}

const usernameTakenError = new ApolloError(
  "Username already taken",
  OnboardingErrorCode.usernameTaken,
);

const invalidUsernameError = new ApolloError(
  "Username does not exist",
  OnboardingErrorCode.invalidUsername,
);

const phoneNumberExistsError = new ApolloError(
  "Phone number already taken",
  OnboardingErrorCode.phoneNumberExists,
);

const emailExistsError = new ApolloError(
  "Email already taken",
  OnboardingErrorCode.emailExists,
);

const verificationCodeError = new ApolloError(
  "Verification code is not correct",
  OnboardingErrorCode.verificationCode,
);

const twillioSendingError = new ApolloError(
  "Twillio verification code is failed",
  OnboardingErrorCode.twillioSending,
);

const invalidCredentialError = new ApolloError(
  "Username or password is not correct",
  OnboardingErrorCode.invalidCredential,
);

const unableToSetProfilePicture = (error: Error) => {
  return new ApolloError(
    `Unable to set profile picture: ${error.message}`,
    OnboardingErrorCode.unableToSetProfilePicture,
  );
};

export const OnboardingError = {
  usernameTakenError,
  phoneNumberExistsError,
  emailExistsError,
  verificationCodeError,
  twillioSendingError,
  invalidCredentialError,
  invalidUsernameError,
  unableToSetProfilePicture,
};
