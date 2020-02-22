import {
  Mutation,
  MutationAuthenticateArgs,
  MutationSendVerificationCodeArgs,
  MutationVerifyPhoneNumberArgs,
  Query,
} from "@ibexcm/libraries/api";
import {
  AuthenticateMutation,
  SendVerificationCodeMutation,
  UserQuery,
  VerifyPhoneNumberMutation,
} from "@ibexcm/libraries/api/user";
import { ApolloError } from "apollo-server-errors";
import axios, { AxiosResponse } from "axios";
import { print } from "graphql";
import { config } from "../../config";

const { port, address } = config.get("express");

const headers = (authToken?: string) => {
  let headers = {
    "Content-Type": "application/json",
  };

  if (!Boolean(authToken)) {
    return headers;
  }

  return { ...headers, Authorization: `Bearer ${authToken}` };
};

const query = async <TVariables, TResponse>(
  query,
  variables?: TVariables,
  authToken?: string,
): Promise<TResponse> => {
  const { data } = await axios(`http://${address}:${port}/graphql`, {
    method: "POST",
    headers: headers(authToken),
    data: {
      query: print(query),
      variables,
    },
  });

  return data;
};

const authenticate = async (args: MutationAuthenticateArgs) => {
  return query<
    MutationAuthenticateArgs,
    AxiosResponse<Pick<Mutation, "authenticate">> & { errors?: ApolloError[] }
  >(AuthenticateMutation, args);
};

const user = async (authToken: string) => {
  return query<void, AxiosResponse<Pick<Query, "user">>>(UserQuery, undefined, authToken);
};

const verifyPhoneNumber = async (args: MutationVerifyPhoneNumberArgs) => {
  return query<
    MutationVerifyPhoneNumberArgs,
    AxiosResponse<Pick<Mutation, "verifyPhoneNumber">> & { errors?: ApolloError[] }
  >(VerifyPhoneNumberMutation, args);
};

const sendVerificationCode = async (args: MutationSendVerificationCodeArgs) => {
  return query<
    MutationSendVerificationCodeArgs,
    AxiosResponse<Pick<Mutation, "sendVerificationCode">> & { errors?: ApolloError[] }
  >(SendVerificationCodeMutation, args);
};

const GraphQLClient = {
  authenticate,
  user,
  verifyPhoneNumber,
  sendVerificationCode,
};

export default GraphQLClient;
