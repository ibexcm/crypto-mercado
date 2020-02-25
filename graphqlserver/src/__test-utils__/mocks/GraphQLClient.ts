import {
  Mutation,
  MutationAuthenticateArgs,
  MutationSendPhoneNumberVerificationCodeArgs,
  MutationVerifyPhoneNumberArgs,
  Query,
} from "@ibexcm/libraries/api";
import {
  AuthenticateMutation,
  SendPhoneNumberVerificationCodeMutation,
  UserQuery,
  VerifyPhoneNumberMutation,
} from "@ibexcm/libraries/api/user";
import { ApolloError } from "apollo-server-errors";
import axios from "axios";
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
): Promise<{ data?: TResponse; errors?: ApolloError[] }> => {
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
    Pick<Mutation, "authenticate"> & { errors?: ApolloError[] }
  >(AuthenticateMutation, args);
};

const user = async (authToken: string) => {
  return query<void, Pick<Query, "user">>(UserQuery, undefined, authToken);
};

const verifyPhoneNumber = async (args: MutationVerifyPhoneNumberArgs) => {
  return query<MutationVerifyPhoneNumberArgs, Pick<Mutation, "verifyPhoneNumber">>(
    VerifyPhoneNumberMutation,
    args,
  );
};

const sendPhoneNumberVerificationCode = async (
  args: MutationSendPhoneNumberVerificationCodeArgs,
) => {
  return query<
    MutationSendPhoneNumberVerificationCodeArgs,
    Pick<Mutation, "sendPhoneNumberVerificationCode">
  >(SendPhoneNumberVerificationCodeMutation, args);
};

const GraphQLClient = {
  authenticate,
  user,
  verifyPhoneNumber,
  sendPhoneNumberVerificationCode,
};

export default GraphQLClient;
