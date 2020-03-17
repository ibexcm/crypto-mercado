import { BehaviorSubject, Observable } from "rxjs";
import { ss as SessionStorage } from "../../utils/ss";

export class Store {
  private observers = new Map<string, BehaviorSubject<string>>();

  set(key: string, value: string) {
    SessionStorage.update(key, value);

    const observer = this.observers.get(key);
    if (observer === undefined) return;

    observer.next(value);
  }

  get(key: string): string {
    return SessionStorage.get(key, "");
  }

  delete(key: string): void {
    SessionStorage.update(key, "");

    const observer = this.observers.get(key);
    if (observer === undefined) return;

    observer.next("");
  }

  observe(key: string): Observable<string> {
    let observer = this.observers.get(key);
    if (observer !== undefined) return observer;

    const value = this.get(key);
    observer = new BehaviorSubject<string>(value);
    this.observers.set(key, observer);

    return observer.asObservable();
  }
}
