import { MutationResult, useMutation } from "@apollo/client";
import { Mutation, MutationAdminAuthenticateArgs } from "@ibexcm/libraries/api";
import { AdminAuthenticateMutation } from "@ibexcm/libraries/api/user";
import { AuthTokenRepository } from "./AuthTokenRepository";

export class AuthenticationRepository {
  private authTokenRepository: AuthTokenRepository;

  constructor(authTokenRepository: AuthTokenRepository) {
    this.authTokenRepository = authTokenRepository;
  }

  useAdminAuthenticateMutation(): {
    execute: (args: MutationAdminAuthenticateArgs) => Promise<void>;
  } {
    const [execute] = useMutation(AdminAuthenticateMutation);

    return {
      execute: async args => {
        const {
          data,
          error,
        }: Partial<MutationResult<Pick<Mutation, "adminAuthenticate">>> = await execute({
          variables: args,
        });

        if (Boolean(error) || !Boolean(data?.adminAuthenticate)) {
          throw new Error("Acceso denegado.");
        }

        const {
          adminAuthenticate: { token },
        } = data as Pick<Mutation, "adminAuthenticate">;

        this.authTokenRepository.setAuthToken(token as string);
      },
    };
  }
}
