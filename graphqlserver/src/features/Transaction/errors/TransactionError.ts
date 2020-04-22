import { ApolloError } from "apollo-server-errors";

export enum TransactionErrorCode {
    transactionDoesNotExist = "transactionDoesNotExist"
}

const transactionDoesNotExist = new ApolloError(
    "Transaction does not exist",
    TransactionErrorCode.transactionDoesNotExist,
  );

  export const TransactionError = {
    transactionDoesNotExist
};
