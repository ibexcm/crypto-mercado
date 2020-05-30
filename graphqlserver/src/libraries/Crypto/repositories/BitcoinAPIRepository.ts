import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { IBitcoinAPIRepository } from "../interfaces/IBitcoinAPIRepository";

export class BitcoinAPIRepository implements IBitcoinAPIRepository {
  async getCurrentPriceByCurrencySymbol(
    symbol: CurrencySymbol = CurrencySymbol.USD,
  ): Promise<string> {
    switch (symbol) {
      case CurrencySymbol.GTQ:
        return (7200 * 7.5).toString();
      default:
        return "7200";
    }
  }

  async getPriceAtDatetimeByCurrencySymbol(
    datetime: Date,
    symbol: CurrencySymbol = CurrencySymbol.USD,
  ): Promise<string> {
    return "7000";
  }
}
