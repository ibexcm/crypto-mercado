import {
  QueryGetTransactionBreakdownArgs,
  TransactionBreakdown,
} from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { TransactionRepositoryInjectionKey } from "../InjectionKeys";

export async function getTransactionBreakdown(
  parent,
  args: QueryGetTransactionBreakdownArgs,
  { dependencies, request }: IContext,
  info,
): Promise<TransactionBreakdown> {
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKey);
  return await TransactionRepository.getTransactionBreakdown(args, request.auth.user);
}
