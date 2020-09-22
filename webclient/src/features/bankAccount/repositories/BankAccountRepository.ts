import { useQuery } from "@apollo/client";
import { Query } from "@ibexcm/libraries/api";
import { GetAdminBankAccountsQuery } from "@ibexcm/libraries/api/bankAccount";

export class BankAccountRepository {
  useGetAdminBankAccountsQuery() {
    return useQuery<Pick<Query, "getAdminBankAccounts">>(GetAdminBankAccountsQuery, {
      fetchPolicy: "cache-and-network",
    });
  }
}
