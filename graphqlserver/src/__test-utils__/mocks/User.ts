import { Prisma, User } from "@ziina/database";
import { genSalt, hash } from "bcryptjs";

export const newContact = async (db: Prisma, number: string): Promise<string> => {
  const contact = await db.createContact({
    phoneNumber: {
      create: {
        number,
        verifiedAt: new Date(),
      },
    },
  });

  await db.createAccount({
    contact: {
      connect: {
        id: contact.id,
      },
    },
  });

  return contact.id;
};

export const newUser = async (
  db: Prisma,
  username: string,
  password: string,
  number: string,
): Promise<User> => {
  const user = await db.createUser({
    account: {
      create: {
        username,
        password: await hash(password, await genSalt()),
        signupCompletedAt: new Date(),
      },
    },
  });

  return user;
};
