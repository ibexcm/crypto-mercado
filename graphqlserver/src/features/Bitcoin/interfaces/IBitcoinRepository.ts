import { CurrencySymbol } from "@ibexcm/libraries/models/currency";

export interface IBitcoinPriceResponse {
  symbol: CurrencySymbol;
  price: string;
}

export interface IBitcoinRepository {
  getCurrentPriceByCurrencySymbol: (
    symbol?: CurrencySymbol,
  ) => Promise<IBitcoinPriceResponse>;
  getPriceAtDatetimeByCurrencySymbol: (
    datetime: Date,
    symbol?: CurrencySymbol,
  ) => Promise<IBitcoinPriceResponse>;
}
