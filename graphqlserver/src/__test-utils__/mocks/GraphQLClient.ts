import {
  Mutation,
  MutationSendVerificationCodeArgs,
  MutationVerifyPhoneNumberArgs,
  Query,
} from "@ibexcm/libraries/api";
import {
  SendVerificationCodeMutation,
  UserQuery,
  VerifyPhoneNumberMutation,
} from "@ibexcm/libraries/api/user";
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
}

export default GraphQLClient;
