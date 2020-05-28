import { SetBitcoinTransactionReceiptEvidenceInput } from "../api";

export interface ICryptoTransactionEvidenceCallback {
  onSetCryptoTransactionEvidence: (
    evidence: SetBitcoinTransactionReceiptEvidenceInput,
  ) => Promise<void>;
}
