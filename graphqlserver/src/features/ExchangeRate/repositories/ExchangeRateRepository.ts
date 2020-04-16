import { Currency, ExchangeRate, Prisma } from "@ibexcm/database";

export class ExchangeRateRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async getLatestByCurrency(currency: Currency): Promise<ExchangeRate> {
    return await this.db.exchangeRates({
      where: {
        currency: { id: currency.id },
      },
      orderBy: "createdAt_DESC",
      first: 1,
    })[0];
  }
}
