import { Bank } from "@ibexcm/database";
import { QueryGetBanksByCountryArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { bankRepositoryInjectionKey } from "../InjectionKeys";

export async function getBanksByCountry(
  parent,
  args: QueryGetBanksByCountryArgs,
  { dependencies }: IContext,
  info,
): Promise<Bank[]> {
  const bankRepository = dependencies.provide(bankRepositoryInjectionKey);
  return bankRepository.getBanksByCountry(args);
}
