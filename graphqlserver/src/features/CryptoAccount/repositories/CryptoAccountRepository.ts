import { Currency, Prisma, User } from "@ibexcm/database";
import { MutationCreateBitcoinAccountArgs } from "@ibexcm/libraries/api";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import ValidateBitcoinAddress from "bitcoin-address-validation";
import { CryptoAccountError } from "../errors/CryptoAccountError";

export class CryptoAccountRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async currency(id: string): Promise<Currency> {
    return await this.db.cryptoAccount({ id }).currency();
  }

  async bitcoin(id: string): Promise<Currency> {
    return await this.db.cryptoAccount({ id }).bitcoin();
  }

  async createBitcoinAccount(
    { args: { address } }: MutationCreateBitcoinAccountArgs,
    user: User,
  ): Promise<boolean> {
    const isValidAddress = ValidateBitcoinAddress(address);
    if (!Boolean(isValidAddress)) {
      throw CryptoAccountError.invalidBitcoinAddressExistsError;
    }

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
