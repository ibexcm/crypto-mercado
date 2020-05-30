import { Transaction } from "@ibexcm/database";
import { QueryAdminGetTransactionsArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { TransactionRepositoryInjectionKey } from "../InjectionKeys";

export async function adminGetTransactions(
  parent,
  args: QueryAdminGetTransactionsArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Transaction[]> {
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKey);
  return await TransactionRepository.adminGetTransactions(args);
}
