import { queries as bankQueries } from "../../features/Bank/resolvers";
import { queries as currencyQueries } from "../../features/Currency/resolvers";
import { queries as kycQueries } from "../../features/KYC/resolvers";
import { queries as userQueries } from "../../features/User/resolvers";

export const Query = {
  ...userQueries,
  ...bankQueries,
  ...currencyQueries,
  ...kycQueries,
};
