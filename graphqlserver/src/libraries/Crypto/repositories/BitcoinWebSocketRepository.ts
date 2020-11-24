import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IMessage } from "stompjs/";
import { RxStomp } from "@stomp/rx-stomp";
import { IBitcoinWebSocketRepository } from "../interfaces/IBitcoinWebSocketRepository";

export class BitcoinWebSocketRepository implements IBitcoinWebSocketRepository {
  private baseUrl = "wss://trade-api.nexus.trade/websocket/v1";
  private stompProtocolVersion = "1.1";

  StompClient: RxStomp;

  constructor(StompClient: RxStomp) {
    this.StompClient = StompClient;
  }

  connect(): void {
    this.StompClient.activate();
  }

  async disconnect(): Promise<void> {
    await this.StompClient.deactivate();
  }

  getConnectionStatus(): boolean {
    return this.StompClient.connected();
  }

  setConnectionConfiguration(authorization?: string): void {
    this.StompClient.configure({
      brokerURL: this.baseUrl,
      connectHeaders: {
        authorization,
        "accept-version": this.stompProtocolVersion,
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 2000,
    });
  }

  subscribe(path: string, subscriptionHeaders): Observable<IMessage> {
    return this.StompClient.watch(path, subscriptionHeaders).pipe(
      map(message => JSON.parse(message.body)),
    );
  }
}
