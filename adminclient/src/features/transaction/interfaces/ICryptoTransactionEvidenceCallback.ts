import { SetBitcoinTransactionReceiptEvidenceInput } from "@ibexcm/libraries/api";

export interface ICryptoTransactionEvidenceCallback {
  onSetCryptoTransactionEvidence: (
    evidence: SetBitcoinTransactionReceiptEvidenceInput,
  ) => Promise<void>;
}
