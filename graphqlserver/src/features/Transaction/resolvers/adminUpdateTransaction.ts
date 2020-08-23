import { Transaction } from "@ibexcm/database";
import { MutationAdminUpdateTransactionArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { TransactionRepositoryInjectionKey } from "../InjectionKeys";

export async function adminUpdateTransaction(
  parent,
  args: MutationAdminUpdateTransactionArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Transaction> {
  try {
    const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKey);

    return await TransactionRepository.adminUpdateTransaction(args, request.auth.user);
  } catch (error) {
    console.log(error);
  }
}
