import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { IExchangeRateAPIRepository } from "../interfaces/IExchangeRateAPIRepository";

export class ExchangeRateAPIRepository implements IExchangeRateAPIRepository {
  async getCurrentPriceByCurrencySymbol(
    symbol: CurrencySymbol = CurrencySymbol.USD,
  ): Promise<string> {
    return "";
  }

  async getPriceAtDatetimeByCurrencySymbol(): Promise<string> {
    return "";
  }
}
