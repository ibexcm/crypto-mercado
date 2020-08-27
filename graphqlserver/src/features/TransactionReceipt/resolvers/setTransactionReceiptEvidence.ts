import { Transaction } from "@ibexcm/database";
import { MutationSetTransactionReceiptEvidenceArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { TransactionReceiptRepositoryInjectionKey } from "../InjectionKeys";

export async function setTransactionReceiptEvidence(
  parent,
  args: MutationSetTransactionReceiptEvidenceArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Transaction> {
  const TransactionReceiptRepository = dependencies.provide(
    TransactionReceiptRepositoryInjectionKey,
  );

  return await TransactionReceiptRepository.setTransactionReceiptEvidence(
    args,
    request.auth.user,
  );
}
