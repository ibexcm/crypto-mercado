import { Observable } from "rxjs";
import { IMessage } from "stompjs";

export interface IBitcoinWebSocketRepository {
  connect(): void;
  disconnect(): Promise<void>;
  subscribe(path: string, subscriptionHeaders: any): Observable<IMessage>;
  getConnectionStatus(): boolean;
  setConnectionConfiguration(authorization?: string): void;
}
