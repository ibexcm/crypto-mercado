import {
  Mutation,
  MutationAuthenticateArgs,
  MutationSendEmailVerificationCodeArgs,
  MutationSendPhoneNumberVerificationCodeArgs,
  MutationSetBankAccountArgs,
  MutationSetPasswordArgs,
  MutationUploadGovernmentIdArgs,
  MutationVerifyEmailArgs,
  MutationVerifyPhoneNumberArgs,
  Query,
  QueryGetBanksByCountryArgs,
  QueryGetCurrenciesByCountryArgs,
} from "@ibexcm/libraries/api";
import { GetBanksByCountryQuery } from "@ibexcm/libraries/api/bank";
import { GetCurrenciesByCountryQuery } from "@ibexcm/libraries/api/currency";
import {
  AuthenticateMutation,
  SendEmailVerificationCodeMutation,
  SendPhoneNumberVerificationCodeMutation,
  SetBankAccountMutation,
  SetPasswordMutation,
  UploadGovernmentIDMutation,
  UserQuery,
  VerifyEmailMutation,
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

const getBanksByCountry = async (args: QueryGetBanksByCountryArgs) => {
  return query<QueryGetBanksByCountryArgs, Pick<Query, "getBanksByCountry">>(
    GetBanksByCountryQuery,
    args,
  );
};

const getCurrenciesByCountry = async (args: QueryGetCurrenciesByCountryArgs) => {
  return query<QueryGetCurrenciesByCountryArgs, Pick<Query, "getCurrenciesByCountry">>(
    GetCurrenciesByCountryQuery,
    args,
  );
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

const sendEmailVerificationCode = async (args: MutationSendEmailVerificationCodeArgs) => {
  return query<
    MutationSendEmailVerificationCodeArgs,
    Pick<Mutation, "sendEmailVerificationCode">
  >(SendEmailVerificationCodeMutation, args);
};

const verifyEmail = async (args: MutationVerifyEmailArgs, authToken: string) => {
  return query<MutationVerifyEmailArgs, Pick<Mutation, "verifyEmail">>(
    VerifyEmailMutation,
    args,
    authToken,
  );
};

const setPassword = async (args: MutationSetPasswordArgs, authToken: string) => {
  return query<MutationSetPasswordArgs, Pick<Mutation, "setPassword">>(
    SetPasswordMutation,
    args,
    authToken,
  );
};

const uploadGovernmentID = async (
  args: MutationUploadGovernmentIdArgs,
  authToken: string,
) => {
  return query<MutationUploadGovernmentIdArgs, Pick<Mutation, "uploadGovernmentID">>(
    UploadGovernmentIDMutation,
    args,
    authToken,
  );
};

const setBankAccount = async (args: MutationSetBankAccountArgs, authToken: string) => {
  return query<MutationSetBankAccountArgs, Pick<Mutation, "setBankAccount">>(
    SetBankAccountMutation,
    args,
    authToken,
  );
};

const GraphQLClient = {
  query,
  authenticate,
  user,
  getBanksByCountry,
  getCurrenciesByCountry,
  verifyPhoneNumber,
  sendPhoneNumberVerificationCode,
  sendEmailVerificationCode,
  verifyEmail,
  setPassword,
  uploadGovernmentID,
  setBankAccount,
};

export default GraphQLClient;
