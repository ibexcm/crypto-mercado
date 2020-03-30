import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import React, { useContext } from "react";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { AuthTokenRepositoryInjectionKeys } from "../../authentication/InjectionKeys";

const getApiClientUrl = (): string => {
  return "https://apitest.ibexcm.com";
};

const getClient = (authToken: string | undefined) => {
  const uri = getApiClientUrl();
  const cache = new InMemoryCache();
  const headers = Boolean(authToken)
    ? {
        Authorization: `Bearer ${authToken}`,
      }
    : {};

  return new ApolloClient({
    link: new HttpLink({ uri, headers }),
    cache,
  });
};

export const GraphQL: React.FC = ({ children }) => {
  const dependencies = useContext(DependencyContext);
  const AuthTokenRepository = dependencies.provide(AuthTokenRepositoryInjectionKeys);
  const authToken = AuthTokenRepository.useAuthToken();

  return <ApolloProvider client={getClient(authToken)}>{children}</ApolloProvider>;
};
