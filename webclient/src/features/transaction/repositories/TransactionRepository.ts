import {
  LazyQueryResult,
  MutationResult,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  Mutation,
  MutationCreateTransactionArgs,
  QueryGetTransactionArgs,
  QueryGetTransactionBreakdownArgs,
} from "@ibexcm/libraries/api";
import {
  CreateTransactionMutation,
  GetTransactionBreakdownQuery,
  GetTransactionQuery,
} from "@ibexcm/libraries/api/transaction";
import { Query, Transaction } from "../../../libraries/api";

export class TransactionRepository {
  useGetTransactionQuery(args: QueryGetTransactionArgs) {
    return useQuery<Pick<Query, "getTransaction">>(GetTransactionQuery, {
      variables: args,
      fetchPolicy: "cache-and-network",
    });
  }

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

  useCreateTransactionMutation(): {
    execute: (args: MutationCreateTransactionArgs) => Promise<Transaction>;
    state: MutationResult<Pick<Mutation, "createTransaction">>;
  } {
    const [execute, state] = useMutation(CreateTransactionMutation);

    return {
      execute: async (args) => {
        const message = "No pudimos crear la transacción";
        try {
          const {
            data,
            error,
          }: Partial<MutationResult<Pick<Mutation, "createTransaction">>> = await execute({
            variables: args,
          });

          if (Boolean(error) || !Boolean(data?.createTransaction)) {
            throw new Error(message);
          }

          return data.createTransaction;
        } catch (error) {
          console.error(error);
          throw new Error(message);
        }
      },
      state,
    };
  }
}
