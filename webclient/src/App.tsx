import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import DependencyContext from "./common/contexts/DependencyContext";
import { GraphQL } from "./features/app/components";
import {
  SendEmailVerificationCode,
  SendPhoneNumberVerificationCode,
  VerifyEmail,
  VerifyPhoneNumber,
} from "./features/onboarding/screens";
import { routes } from "./routes";

const App: React.FC = () => {
  const dependencies = React.useContext(DependencyContext);

  return (
    <DependencyContext.Provider value={dependencies}>
      <GraphQL>
        <Router>
          {/* <Route path={routes.root} exact component={Upload} /> */}
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
        </Router>
      </GraphQL>
    </DependencyContext.Provider>
  );
};

export default App;
