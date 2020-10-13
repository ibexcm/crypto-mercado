import { AccountRecoveryError } from "../../features/AccountRecovery/errors/AccountRecoveryError";
import { ApolloError } from "apollo-server-errors";
import { Prisma } from "@ibexcm/database";

export const emailExists = async (
  address: string,
  db: Prisma,
): Promise<boolean | ApolloError> => {
  const user = await db
    .email({ address })
    .contact()
    .user();

  if (Boolean(user)) {
    return true;
  }

  return AccountRecoveryError.unregisteredEmailError;
};

export const phoneNumberExists = async (
  number: string,
  db: Prisma,
): Promise<boolean | ApolloError> => {
  const user = await db
    .phoneNumber({ number })
    .contact()
    .user();

  if (Boolean(user)) {
    true;
  }

  return AccountRecoveryError.unregisteredPhoneNumber;
};

export const accountExists = async (
  address: string,
  number: string,
  db: Prisma,
): Promise<boolean | ApolloError> => {
  const userContact = await db.$exists.contact({
    AND: [{ email_some: { address } }, { phoneNumber_some: { number } }],
  });

  if (Boolean(userContact)) {
    return true;
  }

  return AccountRecoveryError.unregisteredUserError;
};
