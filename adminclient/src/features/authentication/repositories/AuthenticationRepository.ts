import { MutationResult, useMutation } from "@apollo/client";
import { Mutation, MutationAuthenticateArgs } from "@ibexcm/libraries/api";
import { AuthTokenRepository } from "./AuthTokenRepository";

export class AuthenticationRepository {
  private authTokenRepository: AuthTokenRepository;

  constructor(authTokenRepository: AuthTokenRepository) {
    this.authTokenRepository = authTokenRepository;
  }

  useAuthenticateMutation(): {
    execute: (args: MutationAuthenticateArgs) => Promise<void>;
  } {
    const [execute] = useMutation(Authenticate);

    return {
      execute: async args => {
        const {
          data,
          error,
        }: Partial<MutationResult<Pick<Mutation, "adminAuthenticate">>> = await execute({
          variables: args,
        });

        if (Boolean(error) || !Boolean(data?.adminAuthenticate)) {
          throw new Error("No pudimos verificar el SMS");
        }

        const {
          adminAuthenticate: { token },
        } = data as Pick<Mutation, "adminAuthenticate">;

        this.authTokenRepository.setAuthToken(token as string);
      },
    };
  }
}
