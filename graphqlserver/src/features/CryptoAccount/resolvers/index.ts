import { IContext } from "../../../server/interfaces/IContext";
import { cryptoAccountRepositoryInjectionKey } from "../InjectionKeys";
import { createBitcoinAccount } from "./createBitcoinAccount";

export const mutations = {
  createBitcoinAccount,
};

export const types = {
  CryptoAccount: {
    currency: ({ id }, args, { dependencies }: IContext) => {
      const CryptoAccountRepository = dependencies.provide(
        cryptoAccountRepositoryInjectionKey,
      );
      return CryptoAccountRepository.currency(id);
    },
    bitcoin: ({ id }, args, { dependencies }: IContext) => {
      const CryptoAccountRepository = dependencies.provide(
        cryptoAccountRepositoryInjectionKey,
      );
      return CryptoAccountRepository.bitcoin(id);
    },
  },
};
