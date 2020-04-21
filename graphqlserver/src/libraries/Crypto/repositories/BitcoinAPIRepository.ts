import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { IBitcoinAPIRepository } from "../interfaces/IBitcoinAPIRepository";

export class BitcoinAPIRepository implements IBitcoinAPIRepository {
  async getCurrentPriceByCurrencySymbol(
    symbol: CurrencySymbol = CurrencySymbol.USD,
  ): Promise<string> {
    return "7200";
  }

  async getPriceAtDatetimeByCurrencySymbol(
    datetime: Date,
    symbol: CurrencySymbol = CurrencySymbol.USD,
  ): Promise<string> {
    return "7000";
  }
}
