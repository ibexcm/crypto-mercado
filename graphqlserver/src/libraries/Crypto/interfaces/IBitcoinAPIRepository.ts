import { Currency } from "@ibexcm/database";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";

export interface IBitcoinAPIRepository {
  connectToPriceFeedProvider: () => Promise<void>;
  getCurrentPriceByCurrency: (currency: Currency) => Promise<string>;
  getPriceAtDatetimeByCurrencySymbol: (
    datetime: Date,
    symbol?: CurrencySymbol,
  ) => Promise<string>;
}
