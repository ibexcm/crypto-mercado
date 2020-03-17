import React from "react";
import { Subscription } from "rxjs";
import { Store } from "../../../libraries/store";

const StoreKeys = {
  authToken: "authToken",
};

export class AuthTokenRepository {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  useAuthToken() {
    const [authToken, setAuthToken] = React.useState<string>();
    let subscription: Subscription;

    const subscribe = () => {
      subscription = this.store.observe(StoreKeys.authToken).subscribe(setAuthToken);
    };

    React.useEffect(() => {
      subscribe();
      return () => {
        /* eslint-disable @typescript-eslint/no-unused-expressions */
        Boolean(subscription) ? subscription.unsubscribe() : () => null;
      };
    }, []);

    return authToken;
  }

  setAuthToken(token: string) {
    return this.store.set(StoreKeys.authToken, token);
  }

  refreshToken() {
    const token = this.store.get(StoreKeys.authToken);
    this.deleteAuthToken();
    this.setAuthToken(token);
  }

  deleteAuthToken() {
    return this.store.delete(StoreKeys.authToken);
  }
}
