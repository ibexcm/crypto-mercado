import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import DependencyContext from "./common/contexts/DependencyContext";
import { GraphQL } from "./features/app/components";
import { Authenticate } from "./features/authentication/screens";
import { Home } from "./features/home/screens";
import {
  Done,
  SendEmailVerificationCode,
  SendPhoneNumberVerificationCode,
  SetBankAccount,
  SetPassword,
  UploadGovernmentID,
  VerifyEmail,
  VerifyPhoneNumber,
} from "./features/onboarding/screens";
import { SellBitcoin, TransactionsIndex } from "./features/transaction/screens";
import { routes } from "./routes";

const App: React.FC = () => {
  const dependencies = React.useContext(DependencyContext);

  return (
    <DependencyContext.Provider value={dependencies}>
      <GraphQL>
        <Router>
          <Route path={routes.root} exact component={Home} />

          {/* AUTHENTICATION */}
          <Route path={routes.authentication.signIn} exact component={Authenticate} />

          {/* ONBOARDING */}
          <Route
            path={routes.onboarding.sendPhoneNumberVerificationCode}
            exact
            component={SendPhoneNumberVerificationCode}
          />
          <Route
            path={routes.onboarding.verifyPhoneNumber}
            exact
            component={VerifyPhoneNumber}
          />
          <Route
            path={routes.onboarding.sendEmailVerificationCode}
            exact
            component={SendEmailVerificationCode}
          />
          <Route path={routes.onboarding.verifyEmail} exact component={VerifyEmail} />
          <Route path={routes.onboarding.setPassword} exact component={SetPassword} />
          <Route
            path={routes.onboarding.uploadGovernmentID}
            exact
            component={UploadGovernmentID}
          />
          <Route path={routes.onboarding.setBankAccount} exact component={SetBankAccount} />
          <Route path={routes.onboarding.done} exact component={Done} />

          {/* TRANSACTION */}
          <Route
            path={routes.dashboard.transactions.index}
            exact
            component={TransactionsIndex}
          />
          <Route path={routes.dashboard.bitcoin.sell} exact component={SellBitcoin} />
        </Router>
      </GraphQL>
    </DependencyContext.Provider>
  );
};

export default App;
