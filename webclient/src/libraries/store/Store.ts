import Cookies from "js-cookie";
import { BehaviorSubject, Observable } from "rxjs";

export class Store {
  private observers = new Map<string, BehaviorSubject<string>>();

  set(key: string, value: string, config?: any) {
    Cookies.set(key, value, config);

    const observer = this.observers.get(key);
    if (observer === undefined) return;

    observer.next(value);
  }

  get(key: string): string | undefined {
    return Cookies.get(key);
  }

  delete(key: string): void {
    Cookies.set(key, "");

    const observer = this.observers.get(key);
    if (observer === undefined) return;

    observer.next("");
  }

  observe(key: string): Observable<string> {
    let observer = this.observers.get(key);
    if (observer !== undefined) return observer;

    const value = this.get(key) as string;
    observer = new BehaviorSubject<string>(value);
    this.observers.set(key, observer);

    return observer.asObservable();
  }
}
