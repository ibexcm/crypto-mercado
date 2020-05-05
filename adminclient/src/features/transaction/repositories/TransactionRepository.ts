import { useQuery } from "@apollo/client";
import { Query, QueryAdminGetTransactionsArgs } from "@ibexcm/libraries/api";
import { AdminGetTransactionsQuery } from "@ibexcm/libraries/api/transaction";

export class TransactionRepository {
  useAdminGetTransactionsQuery(args: QueryAdminGetTransactionsArgs) {
    return useQuery<Pick<Query, "adminGetTransactions">>(AdminGetTransactionsQuery, {
      fetchPolicy: "network-only",
      variables: args,
    });
  }
}
