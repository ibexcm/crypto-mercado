import { mutations as authenticationMutations } from "../../features/Authentication/resolvers";
import { mutations as kycMutations } from "../../features/KYC/resolvers";
import { mutations as onboardingMutations } from "../../features/Onboarding/resolvers";

export const Mutation = {
  ...onboardingMutations,
  ...authenticationMutations,
  ...kycMutations,
};
