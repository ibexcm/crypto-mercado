import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import axios, { AxiosResponse } from "axios";
import { config } from "../../../config";
import { IBitcoinAPIRepository } from "../interfaces/IBitcoinAPIRepository";
import { IShiftMarketsAuthenticationResponse } from "../interfaces/IShiftMarketsAuthenticationResponse";
import { IShiftMarketsHistoricalBarsResponse } from "../interfaces/IShiftMarketsHistoricalBarsResponse";

const { username, password, exchangeName } = config.get("shiftMarkets");

export class BitcoinAPIRepository implements IBitcoinAPIRepository {
  static baseUrlAuth = "https://api.cryptosrvc.com/authentication";
  static baseUrl = "https://trade-api.nexus.trade/api/v1";
  static periodicity = 15000;

  private clientAccessToken: string;
  private expiresIn: number;
  private keepAliveInterval: NodeJS.Timeout;

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

  async getCurrentPriceByCurrencySymbol(
    symbol: CurrencySymbol = CurrencySymbol.USD,
  ): Promise<string> {
    const startTime = new Date().getTime() - BitcoinAPIRepository.periodicity;
    const endTime = new Date().getTime();

    const response: AxiosResponse<IShiftMarketsHistoricalBarsResponse[]> = await axios.request(
      {
        method: "GET",
        url: `${BitcoinAPIRepository.baseUrl}/historical-bars/BTCUSD?periodicity=day&startTime=${startTime}&endTime=${endTime}`,
        headers: {
          Authorization: `Bearer ${this.clientAccessToken}`,
          Accept: "application/json",
          "x-deltix-nonce": new Date().getTime(),
        },
      },
    );

    const historicalBars = response.data;

    // if (historicalBars.length === 0) {
    //   throw BitcoinError.emptyHistoricalPrices;
    // }

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

  private keepAlive(): void {
    if (Boolean(this.keepAliveInterval)) {
      clearInterval(this.keepAliveInterval);
    }

    this.keepAliveInterval = setInterval(() => {
      this.connectToPriceFeedProvider();
    }, Math.floor(this.expiresIn / 1.15));
  }
}
