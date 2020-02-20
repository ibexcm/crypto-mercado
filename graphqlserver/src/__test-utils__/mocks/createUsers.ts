import { Prisma } from "@ziina/database";
import Faker from "faker";

export const createUsers = async (db: Prisma, numberOfUsers: number) =>
  Promise.all(
    Array<number>(numberOfUsers)
      .fill(numberOfUsers)
      .map((_, num) => {
        return db.createUser({
          account: {
            create: {
              username: Faker.internet.userName(),
              password: Faker.internet.password(),
              fullName: Faker.fake("{{name.firstName}} {{name.lastName}}"),
              signupCompletedAt: new Date(),
              contact: {
                create: {
                  phoneNumber: {
                    create: {
                      number: Faker.phone.phoneNumber(),
                    },
                  },
                },
              },
            },
          },
        });
      }),
  );
