import { IContext } from "../../../server/interfaces/IContext";
import { transactionRepositoryInjectionKey } from "../InjectionKeys";
import { createTransaction } from "./createTransaction";

export const mutations = {
  createTransaction,
};

export const types = {
  Transaction: {
    sender: ({ id }, args, { dependencies }: IContext) => {
      const TransactionRepository = dependencies.provide(transactionRepositoryInjectionKey);
      return TransactionRepository.sender(id);
    },
    recipient: ({ id }, args, { dependencies }: IContext) => {
      const TransactionRepository = dependencies.provide(transactionRepositoryInjectionKey);
      return TransactionRepository.recipient(id);
    },
    receipt: ({ id }, args, { dependencies }: IContext) => {
      const TransactionRepository = dependencies.provide(transactionRepositoryInjectionKey);
      return TransactionRepository.receipt(id);
    },
  },
};
