import React from "react";
import { Subscription } from "rxjs";
import { Store } from "../../../libraries/store";

const StoreKeys = {
  adminAuthToken: "adminAuthToken",
};

export class AuthTokenRepository {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  useAuthToken() {
    const [authToken, setAuthToken] = React.useState<string | undefined>(
      this.store.get(StoreKeys.adminAuthToken),
    );

    let subscription: Subscription;

    const subscribe = () => {
      subscription = this.store.observe(StoreKeys.adminAuthToken).subscribe(setAuthToken);
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
    return this.store.set(StoreKeys.adminAuthToken, token, { expires });
  }

  deleteAuthToken() {
    return this.store.delete(StoreKeys.adminAuthToken);
  }
}
