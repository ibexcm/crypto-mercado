import { IContext } from "../../../server/interfaces/IContext";
import { cryptoAccountRepositoryInjectionKey } from "../InjectionKeys";

export const types = {
  CryptoAccount: {
    currency: ({ id }, args, { dependencies }: IContext) => {
      const CryptoAccountRepository = dependencies.provide(
        cryptoAccountRepositoryInjectionKey,
      );
      return CryptoAccountRepository.currency(id);
    },
  },
};
