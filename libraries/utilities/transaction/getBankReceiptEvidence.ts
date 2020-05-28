import { TransactionReceiptEvidence } from "../../api";

export const getBankReceiptEvidence = (evidence: TransactionReceiptEvidence[]) =>
  evidence
    .map((type) => {
      if (Boolean(type?.bankReceipt)) {
        return type.bankReceipt;
      }
    })
    .filter(Boolean);

export default getBankReceiptEvidence;
