import { Country, Currency } from "@ibexcm/database";
import { CountrySymbol } from "@ibexcm/libraries/models/country";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { config } from "../../../config";

const { adminAccountEmailAddress } = config.get("flags");

export class TransactionTaxRepository {
  getTaxByCountry(country: Country): string {
    switch (country.symbol) {
      case CountrySymbol.GTQ:
        return (12 / 100).toString();
      default:
        return "0.00";
    }
  }

  getTaxByCurrency(currency: Currency): string {
    switch (currency.symbol) {
      case CurrencySymbol.GTQ:
        return (12 / 100).toString();
      default:
        return "0.00";
    }
  }
}
