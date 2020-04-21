import { Transaction } from "@ibexcm/database";
import { MutationCreateTransactionArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { TransactionRepositoryInjectionKey } from "../InjectionKeys";

export async function createTransaction(
  parent,
  args: MutationCreateTransactionArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Transaction> {
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKey);
  return await TransactionRepository.createTransaction(args, request.auth.user);
}
