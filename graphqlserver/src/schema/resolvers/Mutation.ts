import { mutations as authenticationMutations } from "../../features/Authentication/resolvers";
import { mutations as cryptoAccountMutations } from "../../features/CryptoAccount/resolvers";
import { mutations as exchangeRateMutations } from "../../features/ExchangeRate/resolvers";
import { mutations as kycMutations } from "../../features/KYC/resolvers";
import { mutations as onboardingMutations } from "../../features/Onboarding/resolvers";
import { mutations as transactionMutations } from "../../features/Transaction/resolvers";
import { mutations as transactionReceiptMutations } from "../../features/TransactionReceipt/resolvers";

export const Mutation = {
  ...onboardingMutations,
  ...authenticationMutations,
  ...kycMutations,
  ...transactionMutations,
  ...cryptoAccountMutations,
  ...transactionReceiptMutations,
  ...exchangeRateMutations,
};
