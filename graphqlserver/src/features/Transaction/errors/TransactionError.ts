import { ApolloError } from "apollo-server-errors";

export enum TransactionErrorCode {
  transactionDoesNotExist = "transactionDoesNotExist",
  invalidTransactionUser = "invalidTransactionUser",
  transactionPaid = "transactionPaid",
}

const transactionDoesNotExist = new ApolloError(
  "Transaction does not exist",
  TransactionErrorCode.transactionDoesNotExist,
);

const invalidTransactionUser = new ApolloError(
  "Invalid transaction user",
  TransactionErrorCode.invalidTransactionUser,
);

const transactionPaid = new ApolloError(
  "Transaction is already paid",
  TransactionErrorCode.transactionPaid,
);

export const TransactionError = {
  transactionDoesNotExist,
  invalidTransactionUser,
  transactionPaid,
};
