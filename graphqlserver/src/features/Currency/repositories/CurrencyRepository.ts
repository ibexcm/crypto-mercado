import { Currency, Prisma } from "@ibexcm/database";
import { QueryGetCurrenciesByCountryArgs } from "@ibexcm/libraries/api";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";

export class CurrencyRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async getCurrenciesByCountry({
    args: { countryID },
  }: QueryGetCurrenciesByCountryArgs): Promise<Currency[]> {
    const country = await this.db.country({ id: countryID });
    const currencies = await this.db.currencies();

    switch (country.symbol) {
      case CurrencySymbol.GTQ:
        return currencies.filter((currency: Currency) =>
          [CurrencySymbol.GTQ, CurrencySymbol.USD].includes(
            currency.symbol as CurrencySymbol,
          ),
        );
        break;
      default:
        return currencies;
        break;
    }
  }
}
