import {
  authenticate,
  createUser,
  sendVerificationCode,
  setFullName,
  setProfilePicture,
  verifyPhoneNumber,
} from "../../features/User/resolvers";

export const Mutation = {
  createUser,
  verifyPhoneNumber,
  sendVerificationCode,
  authenticate,
  setFullName,
  setProfilePicture,
};
