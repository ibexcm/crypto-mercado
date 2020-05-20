import {
  LazyQueryResult,
  MutationResult,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  Mutation,
  MutationSetTransactionReceiptEvidenceArgs,
  Query,
  QueryAdminGetTransactionsArgs,
  QueryGetTransactionArgs,
  QueryGetTransactionBreakdownArgs,
  Transaction,
} from "@ibexcm/libraries/api";
import {
  AdminGetTransactionsQuery,
  GetTransactionBreakdownQuery,
  GetTransactionQuery,
} from "@ibexcm/libraries/api/transaction";
import { SetTransactionReceiptEvidenceMutation } from "@ibexcm/libraries/api/transactionReceipt";
import { DropzoneFile } from "dropzone";

export class TransactionRepository {
  useSetTransactionReceiptEvidenceMutation(): {
    state: MutationResult<Transaction>;
    onAddFile: (file: DropzoneFile) => void;
    onUploadEnd: (args: MutationSetTransactionReceiptEvidenceArgs) => Promise<void>;
  } {
    const [execute, state] = useMutation(SetTransactionReceiptEvidenceMutation);

    const executeSetTransactionReceiptEvidenceMutation = async (args) => {
      const message = "Falló la carga del archivo.";
      try {
        const {
          data,
          error,
        }: Partial<MutationResult<
          Pick<Mutation, "setTransactionReceiptEvidence">
        >> = await execute({
          variables: args,
        });

        if (Boolean(error) || !Boolean(data?.setTransactionReceiptEvidence)) {
          throw new Error(message);
        }

        const { setTransactionReceiptEvidence } = data as Pick<
          Mutation,
          "setTransactionReceiptEvidence"
        >;

        if (!setTransactionReceiptEvidence) {
          throw new Error(message);
        }
      } catch (error) {
        throw new Error(message);
      }
    };

    return {
      state,
      onAddFile: (file) => {
        console.log(file);
      },
      onUploadEnd: async (args) => {
        try {
          await executeSetTransactionReceiptEvidenceMutation(args);
        } catch (error) {
          console.log(error);
        }
      },
    };
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
