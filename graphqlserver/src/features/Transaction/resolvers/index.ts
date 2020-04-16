import { IContext } from "../../../server/interfaces/IContext";
import { TransactionRepositoryInjectionKey } from "../InjectionKeys";
import { createTransaction } from "./createTransaction";
import { getTransactionBreakdown } from "./getTransactionBreakdown";

export const mutations = {
  createTransaction,
};

export const queries = {
  getTransactionBreakdown,
};

export const types = {
  Transaction: {
    sender: ({ id }, args, { dependencies }: IContext) => {
      const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKey);
      return TransactionRepository.sender(id);
    },
    recipient: ({ id }, args, { dependencies }: IContext) => {
      const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKey);
      return TransactionRepository.recipient(id);
    },
    receipt: ({ id }, args, { dependencies }: IContext) => {
      const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKey);
      return TransactionRepository.receipt(id);
    },
  },
};
