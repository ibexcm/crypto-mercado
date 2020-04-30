import { Prisma } from "@ibexcm/database";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import generateBitcoinAddress from "./generateBitcoinAddress";
import onboardUser from "./onboardUser";

export default async (
  {
    number,
    address,
    password,
  }: {
    number?: string;
    address?: string;
    password?: string;
  } = {},
  db: Prisma,
) => {
  const { user } = await onboardUser({ address, password, number });

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
      cryptoAccounts: {
        create: {
          currency: {
            connect: {
              symbol: CurrencySymbol.BTC,
            },
          },
          bitcoin: {
            create: {
              address: await generateBitcoinAddress(),
            },
          },
        },
      },
    },
  });

  return user;
};
