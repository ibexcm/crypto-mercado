import { LazyQueryResult, useLazyQuery } from "@apollo/client";
import { QueryGetTransactionBreakdownArgs } from "@ibexcm/libraries/api";
import { GetTransactionBreakdownQuery } from "@ibexcm/libraries/api/transaction";
import { Query } from "../../../libraries/api";

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
}
