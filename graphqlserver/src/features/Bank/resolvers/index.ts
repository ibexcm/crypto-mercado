import { IContext } from "../../../server/interfaces/IContext";
import { bankRepositoryInjectionKey } from "../InjectionKeys";
import { getBanksByCountry } from "./getBanksByCountry";

export const queries = {
  getBanksByCountry,
};

export const types = {
  Bank: {
    country: ({ id }, args, { dependencies }: IContext) => {
      const bankRepository = dependencies.provide(bankRepositoryInjectionKey);
      return bankRepository.country(id);
    },
  },
};
