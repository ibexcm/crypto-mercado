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
    const [authToken, setAuthToken] = React.useState<string | undefined>(
      this.store.get(StoreKeys.authToken),
    );

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

  setAuthToken(token: string, expires = 7) {
    return this.store.set(StoreKeys.authToken, token, { expires });
  }

  getAuthToken() {
    return this.store.get(StoreKeys.authToken);
  }

  deleteAuthToken() {
    return this.store.delete(StoreKeys.authToken);
  }
}
