import { ExchangeRate } from "@ibexcm/database";
import { MutationAdminSettingsCreateExchangeRateArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { ExchangeRateRepositoryInjectionKey } from "../InjectionKeys";

export async function adminSettingsCreateExchangeRate(
  parent,
  args: MutationAdminSettingsCreateExchangeRateArgs,
  { dependencies, request }: IContext,
  info,
): Promise<ExchangeRate> {
  const ExchangeRateRepository = dependencies.provide(ExchangeRateRepositoryInjectionKey);

  return ExchangeRateRepository.adminSettingsCreateExchangeRate(args, request.auth.user);
}
