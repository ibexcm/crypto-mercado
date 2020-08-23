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
    const [bankAccount] = await this.db.user({ id: user.id }).bankAccounts();

    const { symbol } = await this.db.bankAccount({ id: bankAccount.id }).currency();

    return await this.db.createExchangeRate({
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

  async currency(id: string): Promise<Currency> {
    return await this.db.exchangeRate({ id }).currency();
  }
}
