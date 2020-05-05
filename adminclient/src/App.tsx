import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import DependencyContext from "./common/contexts/DependencyContext";
import { GraphQL } from "./features/app/components";
import { Authenticate } from "./features/authentication/screens";
import { Approval, Evaluate } from "./features/kyc/screens";
import {
  CryptoToFiatTransactionsIndex,
  FiatToCryptoTransactionsIndex,
} from "./features/transaction/screens";
import { routes } from "./routes";

const App: React.FC = () => {
  const dependencies = React.useContext(DependencyContext);

  return (
    <DependencyContext.Provider value={dependencies}>
      <GraphQL>
        <Router>
          <Route path={routes.root} exact component={Authenticate} />

          <Route path={routes.kyc.approval} exact component={Approval} />
          <Route path={routes.kyc.evaluate} exact component={Evaluate} />

          <Route
            path={routes.transaction.cryptoToFiatTransactions}
            exact
            component={CryptoToFiatTransactionsIndex}
          />
          <Route
            path={routes.transaction.fiatToCryptoTransactions}
            exact
            component={FiatToCryptoTransactionsIndex}
          />
        </Router>
      </GraphQL>
    </DependencyContext.Provider>
  );
};

export default App;
