import { IEmailVerificationRepository } from "../interfaces/IEmailVerificationRepository";

const sendVerificationCode = async (address: string) => {
  return true;
};

const verifyCode = async (address: string, code: string) => {
  return true;
};

export const EmailVerificationRepository: IEmailVerificationRepository = {
  sendVerificationCode,
  verifyCode,
};
