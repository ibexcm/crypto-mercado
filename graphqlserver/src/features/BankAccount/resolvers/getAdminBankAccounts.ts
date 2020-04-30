import { BankAccount } from "@ibexcm/database";
import { IContext } from "../../../server/interfaces/IContext";
import { bankAccountRepositoryInjectionKey } from "../InjectionKeys";

export async function getAdminBankAccounts(
  parent,
  args,
  { dependencies, request }: IContext,
  info,
): Promise<BankAccount[]> {
  const BankAccountRepository = dependencies.provide(bankAccountRepositoryInjectionKey);
  return await BankAccountRepository.getAdminBankAccounts();
}
