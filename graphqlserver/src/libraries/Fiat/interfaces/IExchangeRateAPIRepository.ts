import { CurrencySymbol } from "@ibexcm/libraries/models/currency";

export interface IExchangeRateAPIRepository {
  getCurrentPriceByCurrencySymbol: (symbol?: CurrencySymbol) => Promise<string>;
  getPriceAtDatetimeByCurrencySymbol: (datetime: Date) => Promise<string>;
}
