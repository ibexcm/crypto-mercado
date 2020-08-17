import { Currency } from "@ibexcm/database";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";

export interface IBitcoinPriceResponse {
  symbol: string;
  price: string;
}

export interface IBitcoinRepository {
  getCurrentPriceByCurrency: (currency?: Currency) => Promise<IBitcoinPriceResponse>;
  getPriceAtDatetimeByCurrencySymbol: (
    datetime: Date,
    symbol?: CurrencySymbol,
  ) => Promise<IBitcoinPriceResponse>;
}
