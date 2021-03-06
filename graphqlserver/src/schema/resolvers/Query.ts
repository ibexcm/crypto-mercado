import { queries as accountRecoveryQueries } from "../../features/AccountRecovery/resolvers";
import { queries as bankQueries } from "../../features/Bank/resolvers";
import { queries as bankAccountQueries } from "../../features/BankAccount/resolvers";
import { queries as currencyQueries } from "../../features/Currency/resolvers";
import { queries as kycQueries } from "../../features/KYC/resolvers";
import { queries as transactionQueries } from "../../features/Transaction/resolvers";
import { queries as userQueries } from "../../features/User/resolvers";

export const Query = {
  ...accountRecoveryQueries,
  ...userQueries,
  ...bankQueries,
  ...currencyQueries,
  ...kycQueries,
  ...transactionQueries,
  ...bankAccountQueries,
};
