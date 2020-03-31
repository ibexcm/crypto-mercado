import { types as bankTypes } from "../../features/Bank/resolvers";
import { types as bankAccountTypes } from "../../features/BankAccount/resolvers";
import { types as cryptoAccountTypes } from "../../features/CryptoAccount/resolvers";
import { types as recipientTypes } from "../../features/Recipient/resolvers";
import { types as senderTypes } from "../../features/Sender/resolvers";
import { types as transactionTypes } from "../../features/Transaction/resolvers";
import { types as transactionReceiptTypes } from "../../features/TransactionReceipt/resolvers";
import { types as userTypes } from "../../features/User/resolvers";

export const Type = {
  ...bankTypes,
  ...userTypes,
  ...transactionTypes,
  ...senderTypes,
  ...recipientTypes,
  ...transactionReceiptTypes,
  ...bankAccountTypes,
  ...cryptoAccountTypes,
};
