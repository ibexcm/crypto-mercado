import { CurrencySymbol } from "@ibexcm/libraries/models/currency";

export interface IBitcoinAPIRepository {
  connectToPriceFeedProvider: () => Promise<void>;
  getCurrentPriceByCurrencySymbol: (symbol?: CurrencySymbol) => Promise<string>;
  getPriceAtDatetimeByCurrencySymbol: (
    datetime: Date,
    symbol?: CurrencySymbol,
  ) => Promise<string>;
}
