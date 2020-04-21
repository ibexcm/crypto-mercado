import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { UserRepositoryInjectionKeys } from "../../features/user/InjectionKeys";
import routes from "../../routes";
import DependencyContext from "../contexts/DependencyContext";
import { Backdrop } from "./Backdrop";

interface Props extends RouteProps {}

export const PrivateRoute: React.FC<Props> = ({ ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const UserRepository = dependencies.provide(UserRepositoryInjectionKeys);

  const { data, loading, error } = UserRepository.useUserQuery();

  if (loading) {
    return <Backdrop open={loading} />;
  }

  if (Boolean(error) || !Boolean(data.user)) {
    return <Redirect to={routes.authentication.signIn} />;
  }

  return <Route {...props} />;
};
