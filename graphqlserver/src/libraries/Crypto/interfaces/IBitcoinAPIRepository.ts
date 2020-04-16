import { CurrencySymbol } from "@ibexcm/libraries/models/currency";

export interface IBitcoinAPIRepository {
  getCurrentPriceByCurrencySymbol: (symbol?: CurrencySymbol) => Promise<string>;
  getPriceAtDatetimeByCurrencySymbol: (
    datetime: Date,
    symbol?: CurrencySymbol,
  ) => Promise<string>;
}
