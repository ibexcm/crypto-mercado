import { IContext } from "../../../server/interfaces/IContext";
import { transactionReceiptRepositoryInjectionKey } from "../InjectionKeys";

export const types = {
  TransactionReceipt: {
    fromCurrency: ({ id }, args, { dependencies }: IContext) => {
      const TransactionReceiptRepository = dependencies.provide(
        transactionReceiptRepositoryInjectionKey,
      );
      return TransactionReceiptRepository.fromCurrency(id);
    },
    toCurrency: ({ id }, args, { dependencies }: IContext) => {
      const TransactionReceiptRepository = dependencies.provide(
        transactionReceiptRepositoryInjectionKey,
      );
      return TransactionReceiptRepository.toCurrency(id);
    },
    fee: ({ id }, args, { dependencies }: IContext) => {
      const TransactionReceiptRepository = dependencies.provide(
        transactionReceiptRepositoryInjectionKey,
      );
      return TransactionReceiptRepository.fee(id);
    },
    tax: ({ id }, args, { dependencies }: IContext) => {
      const TransactionReceiptRepository = dependencies.provide(
        transactionReceiptRepositoryInjectionKey,
      );
      return TransactionReceiptRepository.tax(id);
    },
    exchangeRate: ({ id }, args, { dependencies }: IContext) => {
      const TransactionReceiptRepository = dependencies.provide(
        transactionReceiptRepositoryInjectionKey,
      );
      return TransactionReceiptRepository.exchangeRate(id);
    },
  },
};
