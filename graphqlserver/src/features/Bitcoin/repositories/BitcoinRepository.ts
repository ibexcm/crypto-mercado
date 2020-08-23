import { Currency } from "@ibexcm/database";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { IBitcoinAPIRepository } from "../../../libraries/Crypto/interfaces/IBitcoinAPIRepository";
import {
  IBitcoinPriceResponse,
  IBitcoinRepository,
} from "../interfaces/IBitcoinRepository";

export class BitcoinRepository implements IBitcoinRepository {
  private BitcoinApiRepository: IBitcoinAPIRepository;

  constructor(BitcoinApiRepository: IBitcoinAPIRepository) {
    this.BitcoinApiRepository = BitcoinApiRepository;
  }

  async getCurrentPriceByCurrency(currency: Currency): Promise<IBitcoinPriceResponse> {
    return {
      symbol: currency.symbol,
      price: await this.BitcoinApiRepository.getCurrentPriceByCurrency(currency),
    };
  }

  async getPriceAtDatetimeByCurrencySymbol(
    datetime: Date,
    symbol: CurrencySymbol = CurrencySymbol.USD,
  ): Promise<IBitcoinPriceResponse> {
    return {
      symbol,
      price: await this.BitcoinApiRepository.getPriceAtDatetimeByCurrencySymbol(
        datetime,
        symbol,
      ),
    };
  }
}
