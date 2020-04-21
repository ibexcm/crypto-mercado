import gql from "graphql-tag";
import { Receipt, Recipient, Sender } from "./fragments";

export const CreateTransactionMutation = gql`
  mutation CreateTransactionMutation($args: CreateTransactionInput!) {
    createTransaction(args: $args) {
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
