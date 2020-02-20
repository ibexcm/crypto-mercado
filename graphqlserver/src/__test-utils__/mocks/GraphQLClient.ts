import {
  DapiGetAccountsResponse,
  Mutation,
  MutationAuthenticateArgs,
  MutationConnectDapiAccountArgs,
  MutationCreateUserArgs,
  MutationSendVerificationCodeArgs,
  MutationSetAddressArgs,
  MutationSetBankAccountArgs,
  MutationSetFullNameArgs,
  MutationVerifyPhoneNumberArgs,
  Query,
  QueryGetBankAccountsArgs,
} from "@ziina/libraries/api";
import {
  ConnectDapiAccountMutation,
  GetBankAccountsQuery,
  SetAddressMutation,
  SetBankAccountMutation,
} from "@ziina/libraries/api/dapi";
import {
  AuthenticateMutation,
  CreateUserMutation,
  SendVerificationCodeMutation,
  SetFullNameMutation,
  UserQuery,
  VerifyPhoneNumberMutation,
} from "@ziina/libraries/api/user";
import { ApolloError } from "apollo-server-errors";
import axios, { AxiosResponse } from "axios";
import { print } from "graphql";
import { config } from "../../config";

const { port, address } = config.get("express");

class GraphQLClient {
  headers: any = {};

  setAuthHeaders(bearer: string): this {
    if (!Boolean(bearer)) {
      delete this.headers["Authorization"];
      return this;
    }

    this.headers["Authorization"] = `Bearer ${bearer}`;

    return this;
  }

  async query<TVariables, TResponse>(
    query,
    variables?: TVariables,
  ): Promise<AxiosResponse<TResponse>> {
    return axios(`http://${address}:${port}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
      data: {
        query: print(query),
        variables,
      },
    });
  }

  async createUser(args: MutationCreateUserArgs) {
    return this.query<
      MutationCreateUserArgs,
      AxiosResponse<Pick<Mutation, "createUser">> & { errors?: ApolloError[] }
    >(CreateUserMutation, args);
  }

  async authenticate(args: MutationAuthenticateArgs) {
    return this.query<
      MutationAuthenticateArgs,
      AxiosResponse<Pick<Mutation, "authenticate">> & { errors?: ApolloError[] }
    >(AuthenticateMutation, args);
  }

  async user() {
    return this.query<void, AxiosResponse<Pick<Query, "user">>>(UserQuery);
  }

  async verifyPhoneNumber(args: MutationVerifyPhoneNumberArgs) {
    return this.query<
      MutationVerifyPhoneNumberArgs,
      AxiosResponse<Pick<Mutation, "verifyPhoneNumber">> & { errors?: ApolloError[] }
    >(VerifyPhoneNumberMutation, args);
  }

  async sendVerificationCode(args: MutationSendVerificationCodeArgs) {
    return this.query<
      MutationSendVerificationCodeArgs,
      AxiosResponse<Pick<Mutation, "sendVerificationCode">> & { errors?: ApolloError[] }
    >(SendVerificationCodeMutation, args);
  }

  async setFullName(args: MutationSetFullNameArgs) {
    return this.query<
      MutationSetFullNameArgs,
      AxiosResponse<Pick<Mutation, "setFullName">> & { errors?: ApolloError[] }
    >(SetFullNameMutation, args);
  }

  async setBankAccount(args: MutationSetBankAccountArgs) {
    return this.query<
      MutationSetBankAccountArgs,
      AxiosResponse<Pick<Mutation, "setBankAccount">> & { errors?: ApolloError[] }
    >(SetBankAccountMutation, args);
  }

  async setAddress(args: MutationSetAddressArgs) {
    return this.query<
      MutationSetAddressArgs,
      AxiosResponse<Pick<Mutation, "setAddress">> & { errors?: ApolloError[] }
    >(SetAddressMutation, args);
  }

  async connectDapiAccount(args: MutationConnectDapiAccountArgs) {
    return this.query<
      MutationConnectDapiAccountArgs,
      AxiosResponse<Pick<Mutation, "connectDapiAccount">> & { errors?: ApolloError[] }
    >(ConnectDapiAccountMutation, args);
  }

  async getBankAccounts(args: QueryGetBankAccountsArgs) {
    return this.query<
      QueryGetBankAccountsArgs,
      AxiosResponse<
        Pick<Query, "getBankAccounts"> & { getBankAccounts: DapiGetAccountsResponse }
      >
    >(GetBankAccountsQuery, args);
  }
}

export default GraphQLClient;
