import { Currency, ExchangeRate, Prisma, User } from "@ibexcm/database";
import { MutationAdminSettingsCreateExchangeRateArgs } from "@ibexcm/libraries/api";

export class ExchangeRateRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async adminSettingsCreateExchangeRate(
    { args: { price } }: MutationAdminSettingsCreateExchangeRateArgs,
    user: User,
  ): Promise<ExchangeRate> {
    const [
      {
        currency: { symbol },
      },
    ] = await this.db.user({ id: user.id }).bankAccounts();

    return this.db.createExchangeRate({
      price,
      currency: {
        connect: {
          symbol,
        },
      },
    });
  }

  async getLatestByCurrency(currency: Currency): Promise<ExchangeRate> {
    return (
      await this.db.exchangeRates({
        where: {
          currency: { id: currency.id },
        },
        orderBy: "createdAt_DESC",
        first: 1,
      })
    )[0];
  }
}
