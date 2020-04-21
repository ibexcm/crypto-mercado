import gql from "graphql-tag";
import { Receipt } from "./Receipt";
import { Recipient } from "./Recipient";
import { Sender } from "./Sender";

export const Transaction = gql`
  fragment Transaction on Transaction {
    id
    amount
    createdAt
    ...Sender
    ...Recipient
    ...Receipt
  }
  ${Sender}
  ${Recipient}
  ${Receipt}
`;
