import { useQuery } from "@apollo/client";
import { GetAdminBankAccountsQuery } from "@ibexcm/libraries/api/bankAccount";
import { Query } from "../../../libraries/api";

export class BankAccountRepository {
  useGetAdminBankAccountsQuery() {
    return useQuery<Pick<Query, "getAdminBankAccounts">>(GetAdminBankAccountsQuery, {
      fetchPolicy: "cache-and-network",
    });
  }
}
