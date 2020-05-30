import { TransactionReceiptEvidence } from "../../api";

export const getBitcoinReceiptEvidence = (evidence: TransactionReceiptEvidence[]) =>
  evidence
    .map((type) => {
      if (Boolean(type?.bitcoinReceipt)) {
        return type.bitcoinReceipt;
      }
    })
    .filter(Boolean);

export default getBitcoinReceiptEvidence;
