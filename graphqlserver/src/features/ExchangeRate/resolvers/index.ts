import { IContext } from "../../../server/interfaces/IContext";
import { ExchangeRateRepositoryInjectionKey } from "../InjectionKeys";
import { adminSettingsCreateExchangeRate } from "./adminSettingsCreateExchangeRate";

export const mutations = {
  adminSettingsCreateExchangeRate,
};

export const types = {
  ExchangeRate: {
    currency: ({ id }, args, { dependencies }: IContext) => {
      const ExchangeRateRepository = dependencies.provide(
        ExchangeRateRepositoryInjectionKey,
      );
      return ExchangeRateRepository.currency(id);
    },
  },
};
