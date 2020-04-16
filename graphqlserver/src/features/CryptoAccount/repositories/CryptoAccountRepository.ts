import { Currency, Prisma, User } from "@ibexcm/database";
import { MutationCreateBitcoinAccountArgs } from "@ibexcm/libraries/api";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { CryptoAccountError } from "../errors/CryptoAccountError";

export class CryptoAccountRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async currency(id: string): Promise<Currency> {
    return await this.db.cryptoAccount({ id }).currency();
  }

  async createBitcoinAccount(
    { args: { address } }: MutationCreateBitcoinAccountArgs,
    user: User,
  ): Promise<boolean> {
    const cryptoAccountExists = await this.db.$exists.bitcoinAccount({ address });
    if (cryptoAccountExists) {
      throw CryptoAccountError.bitcoinAddressAlreadyExistsError;
    }

    await this.db.updateUser({
      where: {
        id: user.id,
      },
      data: {
        cryptoAccounts: {
          create: {
            currency: {
              connect: {
                symbol: CurrencySymbol.BTC,
              },
            },
            bitcoin: {
              create: {
                address,
              },
            },
          },
        },
      },
    });

    return true;
  }
}