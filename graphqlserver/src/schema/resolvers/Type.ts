import { bankRepositoryInjectionKey } from "../../features/Bank/InjectionKeys";
import { IContext } from "../../server/interfaces/IContext";

export const Type = {
  Bank: {
    country: ({ id }, args, { dependencies }: IContext) => {
      const bankRepository = dependencies.provide(bankRepositoryInjectionKey);
      return bankRepository.country(id);
    },
  },
};
