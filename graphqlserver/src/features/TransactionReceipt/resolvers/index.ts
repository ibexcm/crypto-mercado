import { IContext } from "../../../server/interfaces/IContext";
import { TransactionReceiptRepositoryInjectionKey } from "../InjectionKeys";
import { setTransactionReceiptEvidence } from "./setTransactionReceiptEvidence";

export const mutations = {
  setTransactionReceiptEvidence,
};

export const types = {
  TransactionReceipt: {
    fromCurrency: ({ id }, args, { dependencies }: IContext) => {
      const TransactionReceiptRepository = dependencies.provide(
        TransactionReceiptRepositoryInjectionKey,
      );
      return TransactionReceiptRepository.fromCurrency(id);
    },
    toCurrency: ({ id }, args, { dependencies }: IContext) => {
      const TransactionReceiptRepository = dependencies.provide(
        TransactionReceiptRepositoryInjectionKey,
      );
      return TransactionReceiptRepository.toCurrency(id);
    },
    fee: ({ id }, args, { dependencies }: IContext) => {
      const TransactionReceiptRepository = dependencies.provide(
        TransactionReceiptRepositoryInjectionKey,
      );
      return TransactionReceiptRepository.fee(id);
    },
    tax: ({ id }, args, { dependencies }: IContext) => {
      const TransactionReceiptRepository = dependencies.provide(
        TransactionReceiptRepositoryInjectionKey,
      );
      return TransactionReceiptRepository.tax(id);
    },
    exchangeRate: ({ id }, args, { dependencies }: IContext) => {
      const TransactionReceiptRepository = dependencies.provide(
        TransactionReceiptRepositoryInjectionKey,
      );
      return TransactionReceiptRepository.exchangeRate(id);
    },
  },
};
