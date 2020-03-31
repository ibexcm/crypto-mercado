import { Prisma } from "@ibexcm/database";
import onboardUser from "./onboardUser";

export default async (
  args: {
    number?: string;
    address?: string;
    password?: string;
  } = {},
  db: Prisma,
) => {
  const { user } = await onboardUser(args);

  await db.updateUser({
    where: {
      id: user.id,
    },
    data: {
      role: {
        connect: {
          type: "ADMIN",
        },
      },
    },
  });

  return user;
};
