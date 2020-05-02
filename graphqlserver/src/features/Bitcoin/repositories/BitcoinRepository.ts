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

  async getCurrentPriceByCurrencySymbol(
    symbol: CurrencySymbol = CurrencySymbol.USD,
  ): Promise<IBitcoinPriceResponse> {
    return {
      symbol,
      price: await this.BitcoinApiRepository.getCurrentPriceByCurrencySymbol(symbol),
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
