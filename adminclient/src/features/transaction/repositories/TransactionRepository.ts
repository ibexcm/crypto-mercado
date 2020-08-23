import {
  LazyQueryResult,
  MutationResult,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  Mutation,
  MutationAdminUpdateTransactionArgs,
  MutationSetTransactionReceiptEvidenceArgs,
  Query,
  QueryAdminGetTransactionsArgs,
  QueryGetTransactionArgs,
  QueryGetTransactionBreakdownArgs,
} from "@ibexcm/libraries/api";
import {
  AdminGetTransactionsQuery,
  AdminUpdateTransactionMutation,
  GetTransactionBreakdownQuery,
  GetTransactionQuery,
} from "@ibexcm/libraries/api/transaction";
import { SetTransactionReceiptEvidenceMutation } from "@ibexcm/libraries/api/transactionReceipt";
import { DropzoneFile } from "dropzone";
import React from "react";
import { IUpdateTransactionMethods } from "../interfaces/IUpdateTransactionMethods";

export class TransactionRepository {
  useUpdateTransaction(
    transactionID: string,
  ): {
    updateTransactionMethods: IUpdateTransactionMethods;
    state: MutationResult<Pick<Mutation, "adminUpdateTransaction">>;
    setCryptoEvidenceID: React.Dispatch<React.SetStateAction<string>>;
  } {
    const [cryptoEvidenceID, setCryptoEvidenceID] = React.useState<string>(null);

    const [execute, state] = useMutation<
      Pick<Mutation, "adminUpdateTransaction">,
      MutationAdminUpdateTransactionArgs
    >(AdminUpdateTransactionMutation);

    return {
      updateTransactionMethods: {
        onSetAmount: async (amount: string) => {
          await execute({
            variables: {
              args: {
                id: transactionID,
                amount,
              },
            },
          });
        },
        onSetBasePrice: async (value: string) => {
          if (!Boolean(cryptoEvidenceID)) {
            return;
          }

          await execute({
            variables: {
              args: {
                id: transactionID,
                receipt: {
                  cryptoEvidence: {
                    id: cryptoEvidenceID,
                    price: {
                      value: Number(value),
                    },
                  },
                },
              },
            },
          });
        },
        onSetExchangeRate: async (price: string) => {
          await execute({
            variables: {
              args: {
                id: transactionID,
                receipt: {
                  exchangeRate: {
                    price,
                  },
                },
              },
            },
          });
        },
        onSetFee: async (value: string) => {
          await execute({
            variables: {
              args: {
                id: transactionID,
                receipt: {
                  fee: {
                    value,
                  },
                },
              },
            },
          });
        },
      },
      state,
      setCryptoEvidenceID,
    };
  }

  useSetTransactionReceiptEvidenceMutation(): {
    state: MutationResult<Pick<Mutation, "setTransactionReceiptEvidence">>;
    onAddFile: (file: DropzoneFile) => void;
    onUploadEnd: (args: MutationSetTransactionReceiptEvidenceArgs) => Promise<void>;
  } {
    const [execute, state] = useMutation<
      Pick<Mutation, "setTransactionReceiptEvidence">,
      MutationSetTransactionReceiptEvidenceArgs
    >(SetTransactionReceiptEvidenceMutation);

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
