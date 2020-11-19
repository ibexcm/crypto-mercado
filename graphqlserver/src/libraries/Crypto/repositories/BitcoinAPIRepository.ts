import { Currency } from "@ibexcm/database";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import axios, { AxiosResponse } from "axios";
import { config } from "../../../config";
import { BitcoinError } from "../../../features/Bitcoin/errors/BitcoinError";
import { ExchangeRateRepository } from "../../../features/ExchangeRate/repositories/ExchangeRateRepository";
import { IBitcoinAPIRepository } from "../interfaces/IBitcoinAPIRepository";
import { IShiftMarketsAuthenticationResponse } from "../interfaces/IShiftMarketsAuthenticationResponse";
import { IShiftMarketsSecuritiesResponse } from "../interfaces/IShiftMarketsSecuritiesResponse";

const { username, password, exchangeName } = config.get("shiftMarkets");

export class BitcoinAPIRepository implements IBitcoinAPIRepository {
  static baseUrlAuth = "https://api.cryptosrvc.com/authentication";
  static baseUrl = "https://trade-api.nexus.trade/api/v1";
  static periodicity = 15000;

  private clientAccessToken: string;
  private expiresIn: number;
  private keepAliveInterval: NodeJS.Timeout;
  private exchangeRateRepository: ExchangeRateRepository;

  constructor(exchangeRateRepository: ExchangeRateRepository) {
    this.exchangeRateRepository = exchangeRateRepository;
  }

  async connectToPriceFeedProvider() {
    try {
      const { data } = await this.authenticate();

      if (Boolean(data?.result) && data.result === "success") {
        this.clientAccessToken = data.client_access_token;
        this.expiresIn = data.expires_in;
        this.keepAlive();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getCurrentPriceByCurrency(currency: Currency): Promise<string> {
    const response: AxiosResponse<IShiftMarketsSecuritiesResponse[]> = await axios.request({
      method: "GET",
      url: `${BitcoinAPIRepository.baseUrl}/securities/statistics`,
      headers: {
        Authorization: `Bearer ${this.clientAccessToken}`,
        Accept: "application/json",
        "x-deltix-nonce": new Date().getTime(),
      },
    });

    const securities = response.data;

    if (securities.length === 0) {
      throw BitcoinError.emptyHistoricalPrices;
    }

    const [{ ask }] = securities.filter(security => security.security_id === "BTCUSD");

    switch (currency.symbol) {
      case CurrencySymbol.GTQ:
        const { price } = await this.exchangeRateRepository.getLatestByCurrency(currency);
        return (Number(ask) * Number(price)).toString();
      default:
        return ask;
    }
  }

  async getPriceAtDatetimeByCurrencySymbol(
    datetime: Date,
    symbol: CurrencySymbol = CurrencySymbol.USD,
  ): Promise<string> {
    return "7000";
  }

  private async authenticate(): Promise<
    AxiosResponse<IShiftMarketsAuthenticationResponse>
  > {
    return await axios.request({
      method: "POST",
      url: `${BitcoinAPIRepository.baseUrlAuth}/user_authentication/exchangeToken`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username,
        password,
        exchange: exchangeName,
      },
    });
  }

  private getExecutionTimePeriod() : number {
    const millisecsInOneSecond = 1000;
    const secondsInOneHour = this.expiresIn;

    const timePeriod = Math.round(millisecsInOneSecond * secondsInOneHour);
    
    return timePeriod;
  }

  private keepAlive(): void {
    if (Boolean(this.keepAliveInterval)) {
      clearInterval(this.keepAliveInterval);
    }

    this.keepAliveInterval = setInterval(() => {
      this.connectToPriceFeedProvider();
    }, this.getExecutionTimePeriod());
  }
}
