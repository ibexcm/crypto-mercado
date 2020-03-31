import { mutations as authenticationMutations } from "../../features/Authentication/resolvers";
import { mutations as kycMutations } from "../../features/KYC/resolvers";
import { mutations as onboardingMutations } from "../../features/Onboarding/resolvers";
import { mutations as transactionMutations } from "../../features/Transaction/resolvers";

export const Mutation = {
  ...onboardingMutations,
  ...authenticationMutations,
  ...kycMutations,
  ...transactionMutations,
};
