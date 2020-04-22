import { Transaction } from "@ibexcm/database";
import { QueryGetTransactionArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { TransactionRepositoryInjectionKey } from "../InjectionKeys";

export async function getTransaction(
  parent,
  args: QueryGetTransactionArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Transaction> {
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKey);
  return await TransactionRepository.getTransaction(args);
}
