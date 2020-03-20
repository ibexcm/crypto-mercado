import { Currency } from "@ibexcm/database";
import { QueryGetCurrenciesByCountryArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { currencyRepositoryInjectionKey } from "../InjectionKeys";

export async function getCurrenciesByCountry(
  parent,
  args: QueryGetCurrenciesByCountryArgs,
  { dependencies }: IContext,
  info,
): Promise<Currency[]> {
  const CurrencyRepository = dependencies.provide(currencyRepositoryInjectionKey);
  return CurrencyRepository.getCurrenciesByCountry(args);
}
