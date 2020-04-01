import { Transaction } from "@ibexcm/database";
import { MutationCreateTransactionArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { transactionRepositoryInjectionKey } from "../InjectionKeys";

export async function createTransaction(
  parent,
  args: MutationCreateTransactionArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Transaction> {
  const TransactionRepository = dependencies.provide(transactionRepositoryInjectionKey);
  return await TransactionRepository.createTransaction(args, request.auth.user);
}
