import {
  Mutation,
  MutationAdminAuthenticateArgs,
  MutationAdminDeleteUserArgs, 
  MutationAdminKycApproveUserArgs,
  MutationAdminKycRejectUserArgs,
  MutationAdminSettingsCreateExchangeRateArgs,
  MutationAdminUpdateTransactionArgs,
  MutationAuthenticateArgs,
  MutationCreateBitcoinAccountArgs,
  MutationCreateTransactionArgs,
  MutationResetPasswordArgs,
  MutationSendEmailVerificationCodeArgs,
  MutationSetBankAccountArgs,
  MutationSetPasswordArgs,
  MutationSetTransactionReceiptEvidenceArgs,
  MutationUploadGovernmentIdArgs,
  MutationVerifyEmailArgs,
  Query,
  QueryAdminGetTransactionsArgs,
  QueryAdminGetUserArgs,
  QueryGetBanksByCountryArgs,
  QueryGetCurrenciesByCountryArgs,
  QueryGetTransactionArgs,
  QueryGetTransactionBreakdownArgs,
  QueryRecoverAccountArgs
} from "@ibexcm/libraries/api";
import {
  GetAccountRecoveryLinkQuery,
  ResetPasswordMutation
} from "@ibexcm/libraries/api/accountRecovery";
import { GetBanksByCountryQuery } from "@ibexcm/libraries/api/bank";
import { GetAdminBankAccountsQuery } from "@ibexcm/libraries/api/bankAccount";
import { CreateBitcoinAccountMutation } from "@ibexcm/libraries/api/cryptoAccount";
import { GetCurrenciesByCountryQuery } from "@ibexcm/libraries/api/currency";
import { AdminSettingsCreateExchangeRateMutation } from "@ibexcm/libraries/api/exchangeRate";
import {
  AdminGetUsersWithPendingKYCApprovalQuery,
  AdminKYCApproveUserMutation,
  AdminKYCRejectUserMutation
} from "@ibexcm/libraries/api/kyc";
import {
  AdminGetTransactionsQuery,
  AdminUpdateTransactionMutation,
  CreateTransactionMutation,
  GetTransactionBreakdownQuery,
  GetTransactionQuery
} from "@ibexcm/libraries/api/transaction";
import { SetTransactionReceiptEvidenceMutation } from "@ibexcm/libraries/api/transactionReceipt";
import {
  AdminAuthenticateMutation,
  AdminDeleteUserMutation, AdminGetUserQuery,
  AdminGetUsersQuery,
  AuthenticateMutation,
  SendEmailVerificationCodeMutation,
  SetBankAccountMutation,
  SetPasswordMutation,
  UploadGovernmentIDMutation,
  UserQuery,
  VerifyEmailMutation
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

  if (Boolean(data.errors)) {
    throw new Error(data.errors[0]?.extensions?.code ?? data.errors[0]?.message);
  }

  return data;
};

const authenticate = async (args: MutationAuthenticateArgs) => {
  return query<MutationAuthenticateArgs, Pick<Mutation, "authenticate">>(
    AuthenticateMutation,
    args,
  );
};

const adminAuthenticate = async (args: MutationAdminAuthenticateArgs) => {
  return query<MutationAdminAuthenticateArgs, Pick<Mutation, "adminAuthenticate">>(
    AdminAuthenticateMutation,
    args,
  );
};

const adminGetUsersWithPendingKYCApproval = async (authToken: string) => {
  return query<void, Pick<Query, "adminGetUsersWithPendingKYCApproval">>(
    AdminGetUsersWithPendingKYCApprovalQuery,
    null,
    authToken,
  );
};

const user = async (authToken: string) => {
  return query<void, Pick<Query, "user">>(UserQuery, undefined, authToken);
};

const adminGetUser = async (args: QueryAdminGetUserArgs, authToken: string) => {
  return query<QueryAdminGetUserArgs, Pick<Query, "adminGetUser">>(
    AdminGetUserQuery,
    args,
    authToken,
  );
};

const adminDeleteUser = async (args: MutationAdminDeleteUserArgs, authToken: string) => {
  return query<MutationAdminDeleteUserArgs, Pick<Mutation, "adminDeleteUser">>(
    AdminDeleteUserMutation,
    args,
    authToken,
  );
};

const adminGetUsers = async (authToken: string) => {
  return query<null, Pick<Query, "adminGetUsers">>(
    AdminGetUsersQuery,
    null,
    authToken,
  );
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

const adminKYCApproveUser = async (
  args: MutationAdminKycApproveUserArgs,
  authToken: string,
) => {
  return query<MutationAdminKycApproveUserArgs, Pick<Mutation, "adminKYCApproveUser">>(
    AdminKYCApproveUserMutation,
    args,
    authToken,
  );
};

const adminKYCRejectUser = async (
  args: MutationAdminKycRejectUserArgs,
  authToken: string,
) => {
  return query<MutationAdminKycRejectUserArgs, Pick<Mutation, "adminKYCRejectUser">>(
    AdminKYCRejectUserMutation,
    args,
    authToken,
  );
};

const createTransaction = async (
  args: MutationCreateTransactionArgs,
  authToken: string,
) => {
  return query<MutationCreateTransactionArgs, Pick<Mutation, "createTransaction">>(
    CreateTransactionMutation,
    args,
    authToken,
  );
};

const getTransactionBreakdown = async (
  args: QueryGetTransactionBreakdownArgs,
  authToken: string,
) => {
  return query<QueryGetTransactionBreakdownArgs, Pick<Query, "getTransactionBreakdown">>(
    GetTransactionBreakdownQuery,
    args,
    authToken,
  );
};

const getTransaction = async (args: QueryGetTransactionArgs, authToken: string) => {
  return query<QueryGetTransactionArgs, Pick<Query, "getTransaction">>(
    GetTransactionQuery,
    args,
    authToken,
  );
};

const createBitcoinAccount = async (
  args: MutationCreateBitcoinAccountArgs,
  authToken: string,
) => {
  return query<MutationCreateBitcoinAccountArgs, Pick<Mutation, "createBitcoinAccount">>(
    CreateBitcoinAccountMutation,
    args,
    authToken,
  );
};

const setTransactionReceiptEvidence = async (
  args: MutationSetTransactionReceiptEvidenceArgs,
  authToken: string,
) => {
  return query<
    MutationSetTransactionReceiptEvidenceArgs,
    Pick<Mutation, "setTransactionReceiptEvidence">
  >(SetTransactionReceiptEvidenceMutation, args, authToken);
};

const getAdminBankAccounts = async (authToken: string) => {
  return query<void, Pick<Query, "getAdminBankAccounts">>(
    GetAdminBankAccountsQuery,
    undefined,
    authToken,
  );
};

const adminGetTransactions = async (
  args: QueryAdminGetTransactionsArgs,
  authToken: string,
) => {
  return query<QueryAdminGetTransactionsArgs, Pick<Query, "adminGetTransactions">>(
    AdminGetTransactionsQuery,
    args,
    authToken,
  );
};

const adminSettingsCreateExchangeRate = async (
  args: MutationAdminSettingsCreateExchangeRateArgs,
  authToken: string,
) => {
  return query<
    MutationAdminSettingsCreateExchangeRateArgs,
    Pick<Mutation, "adminSettingsCreateExchangeRate">
  >(AdminSettingsCreateExchangeRateMutation, args, authToken);
};

const adminUpdateTransaction = async (
  args: MutationAdminUpdateTransactionArgs,
  authToken: string,
) => {
  return query<
    MutationAdminUpdateTransactionArgs,
    Pick<Mutation, "adminUpdateTransaction">
  >(AdminUpdateTransactionMutation, args, authToken);
};

const recoverAccount = async (args: QueryRecoverAccountArgs) => {
  return query<QueryRecoverAccountArgs, Pick<Query, "recoverAccount">>(
    GetAccountRecoveryLinkQuery,
    args,
  );
};

const resetPassword = async (args: MutationResetPasswordArgs, authToken: string) => {
  return query<MutationResetPasswordArgs, Pick<Mutation, "resetPassword">>(
    ResetPasswordMutation,
    args,
    authToken,
  );
};

const GraphQLClient = {
  query,
  authenticate,
  adminAuthenticate,
  adminGetUser,
  adminGetUsers,
  user,
  recoverAccount,
  resetPassword,
  getBanksByCountry,
  getCurrenciesByCountry,
  sendEmailVerificationCode,
  verifyEmail,
  setPassword,
  uploadGovernmentID,
  setBankAccount,
  adminGetUsersWithPendingKYCApproval,
  adminKYCApproveUser,
  adminKYCRejectUser,
  createTransaction,
  createBitcoinAccount,
  getTransactionBreakdown,
  getTransaction,
  getAdminBankAccounts,
  setTransactionReceiptEvidence,
  adminGetTransactions,
  adminSettingsCreateExchangeRate,
  adminUpdateTransaction,
  adminDeleteUser
};

export default GraphQLClient;
