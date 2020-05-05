import { LazyQueryResult, useLazyQuery, useQuery } from "@apollo/client";
import {
  Query,
  QueryAdminGetTransactionsArgs,
  QueryGetTransactionArgs,
  QueryGetTransactionBreakdownArgs,
} from "@ibexcm/libraries/api";
import {
  AdminGetTransactionsQuery,
  GetTransactionBreakdownQuery,
  GetTransactionQuery,
} from "@ibexcm/libraries/api/transaction";

export class TransactionRepository {
  useGetTransactionBreakdownQuery(): [
    (args: QueryGetTransactionBreakdownArgs) => Promise<void>,
    LazyQueryResult<
      Pick<Query, "getTransactionBreakdown">,
      QueryGetTransactionBreakdownArgs
    >,
  ] {
    const [execute, state] = useLazyQuery<
      Pick<Query, "getTransactionBreakdown">,
      QueryGetTransactionBreakdownArgs
    >(GetTransactionBreakdownQuery, { fetchPolicy: "network-only" });

    const executeGetTransasactionBreakdownQuery = async (
      args: QueryGetTransactionBreakdownArgs,
    ) => execute({ variables: args });

    return [executeGetTransasactionBreakdownQuery, state];
  }

  useGetTransactionQuery(args: QueryGetTransactionArgs) {
    return useQuery<Pick<Query, "getTransaction">>(GetTransactionQuery, {
      variables: args,
      fetchPolicy: "cache-and-network",
    });
  }

  useAdminGetTransactionsQuery(args: QueryAdminGetTransactionsArgs) {
    return useQuery<Pick<Query, "adminGetTransactions">>(AdminGetTransactionsQuery, {
      fetchPolicy: "network-only",
      variables: args,
    });
  }
}
