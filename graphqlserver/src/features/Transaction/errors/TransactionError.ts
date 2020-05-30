import { ApolloError } from "apollo-server-errors";

export enum TransactionErrorCode {
  transactionDoesNotExist = "transactionDoesNotExist",
  invalidTransactionUser = "invalidTransactionUser",
}

const transactionDoesNotExist = new ApolloError(
  "Transaction does not exist",
  TransactionErrorCode.transactionDoesNotExist,
);

const invalidTransactionUser = new ApolloError(
  "Invalid transaction user",
  TransactionErrorCode.invalidTransactionUser,
);

export const TransactionError = {
  transactionDoesNotExist,
  invalidTransactionUser,
};
