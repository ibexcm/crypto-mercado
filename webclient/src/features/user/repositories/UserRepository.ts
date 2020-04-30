import { ApolloError, MutationResult, useMutation, useQuery } from "@apollo/client";
import { Mutation, MutationCreateBitcoinAccountArgs } from "@ibexcm/libraries/api";
import { CreateBitcoinAccountMutation } from "@ibexcm/libraries/api/cryptoAccount";
import { UserQuery } from "@ibexcm/libraries/api/user";
import { Query } from "../../../libraries/api";
import { AuthTokenRepository } from "../../authentication/repositories/AuthTokenRepository";

export class UserRepository {
  private AuthTokenRepository: AuthTokenRepository;

  constructor(AuthTokenRepository: AuthTokenRepository) {
    this.AuthTokenRepository = AuthTokenRepository;
  }

  useUserQuery() {
    return useQuery<Pick<Query, "user">>(UserQuery, {
      fetchPolicy: "cache-and-network",
    });
  }

  useCreateBitcoinAccountMutation(): {
    execute: (args: MutationCreateBitcoinAccountArgs) => Promise<boolean>;
    state: MutationResult<Pick<Mutation, "createBitcoinAccount">>;
  } {
    const [execute, state] = useMutation(CreateBitcoinAccountMutation);

    return {
      execute: async (args) => {
        const message = "No pudimos agregar tu dirección";
        try {
          const {
            data,
            error,
          }: Partial<MutationResult<
            Pick<Mutation, "createBitcoinAccount">
          >> = await execute({
            variables: args,
          });

          if (Boolean(error) || !Boolean(data?.createBitcoinAccount)) {
            throw new Error(message);
          }

          return data.createBitcoinAccount;
        } catch (error) {
          console.error(error);

          if (Boolean(error?.graphQLErrors) && error.graphQLErrors.length > 0) {
            if (
              (error as ApolloError).graphQLErrors[0].extensions.code ===
              "invalidBitcoinAddress"
            ) {
              throw new Error("Dirección inválida");
            }

            if (
              (error as ApolloError).graphQLErrors[0].extensions.code ===
              "bitcoinAddressAlreadyExists"
            ) {
              throw new Error("Esta dirección ya existe.");
            }
          }

          throw new Error(message);
        }
      },
      state,
    };
  }
}
