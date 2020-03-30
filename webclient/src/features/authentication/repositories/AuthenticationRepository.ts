import { MutationResult, useMutation } from "@apollo/client";
import { Mutation, MutationAuthenticateArgs } from "@ibexcm/libraries/api";
import { AuthenticateMutation } from "@ibexcm/libraries/api/user";
import { AuthTokenRepository } from "./AuthTokenRepository";

export class AuthenticationRepository {
  private AuthTokenRepository: AuthTokenRepository;

  constructor(AuthTokenRepository: AuthTokenRepository) {
    this.AuthTokenRepository = AuthTokenRepository;
  }

  useAuthenticateMutation(): {
    execute: (args: MutationAuthenticateArgs) => Promise<void>;
  } {
    const [execute] = useMutation(AuthenticateMutation);

    return {
      execute: async args => {
        const message = "Error al iniciar sesión. Intenta de nuevo.";
        try {
          const {
            data,
            error,
          }: Partial<MutationResult<Pick<Mutation, "authenticate">>> = await execute({
            variables: args,
          });

          if (Boolean(error) || !Boolean(data?.authenticate)) {
            throw new Error(message);
          }

          const {
            authenticate: { token },
          } = data as Pick<Mutation, "authenticate">;

          this.AuthTokenRepository.setAuthToken(token as string);
        } catch (error) {
          if (Boolean(error?.graphQLErrors.length > 0)) {
            if (error.graphQLErrors[0].extensions.code === "invalidUsername") {
              throw new Error("El correo electrónico no existe.");
            }

            if (error.graphQLErrors[0].extensions.code === "invalidPassword") {
              throw new Error("El usuario o contraseña es incorrecta.");
            }

            if (error.graphQLErrors[0].extensions.code === "invalidBankAccount") {
              throw new Error("Tu solicitud está en proceso de aprobación.");
            }
          }

          throw new Error(message);
        }
      },
    };
  }
}
