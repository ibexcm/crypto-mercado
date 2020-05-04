import gql from "graphql-tag";
import { Receipt, Recipient, Sender } from "../transaction/fragments";

export const SetTransactionReceiptEvidenceMutation = gql`
  mutation SetTransactionReceiptEvidenceMutation(
    $args: SetTransactionReceiptEvidenceInput!
  ) {
    setTransactionReceiptEvidence(args: $args) {
      id
      amount
      createdAt
      ...Sender
      ...Recipient
      ...Receipt
    }
  }
  ${Sender}
  ${Recipient}
  ${Receipt}
`;
