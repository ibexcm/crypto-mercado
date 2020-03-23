import { LazyQueryResult, MutationResult, useLazyQuery, useMutation } from "@apollo/client";
import {
  Mutation,
  MutationSendEmailVerificationCodeArgs,
  MutationSendPhoneNumberVerificationCodeArgs,
  MutationSetBankAccountArgs,
  MutationSetPasswordArgs,
  MutationUploadGovernmentIdArgs,
  MutationVerifyEmailArgs,
  MutationVerifyPhoneNumberArgs,
  Query,
  QueryGetBanksByCountryArgs,
  QueryGetCurrenciesByCountryArgs,
} from "@ibexcm/libraries/api";
import { GetBanksByCountryQuery } from "@ibexcm/libraries/api/bank";
import { GetCurrenciesByCountryQuery } from "@ibexcm/libraries/api/currency";
import {
  SendEmailVerificationCodeMutation,
  SendPhoneNumberVerificationCodeMutation,
  SetBankAccountMutation,
  SetPasswordMutation,
  UploadGovernmentIDMutation,
  VerifyEmailMutation,
  VerifyPhoneNumberMutation,
} from "@ibexcm/libraries/api/user";
import { AuthTokenRepository } from "../../authentication/repositories/AuthTokenRepository";

export class OnboardingRepository {
  private AuthTokenRepository: AuthTokenRepository;

  constructor(AuthTokenRepository: AuthTokenRepository) {
    this.AuthTokenRepository = AuthTokenRepository;
  }

  reset(): this {
    this.AuthTokenRepository.deleteAuthToken();
    return this;
  }

  useSendPhoneNumberVerificationCodeMutation(): {
    execute: (args: MutationSendPhoneNumberVerificationCodeArgs) => Promise<void>;
  } {
    const [execute] = useMutation(SendPhoneNumberVerificationCodeMutation);

    return {
      execute: async args => {
        const {
          data,
          error,
        }: Partial<MutationResult<
          Pick<Mutation, "sendPhoneNumberVerificationCode">
        >> = await execute({
          variables: args,
        });

        if (Boolean(error)) {
          throw error;
        }

        if (!Boolean(data?.sendPhoneNumberVerificationCode)) {
          throw new Error("No pudimos enviar el SMS");
        }
      },
    };
  }

  useVerifyPhoneNumberMutation(): {
    execute: (args: MutationVerifyPhoneNumberArgs) => Promise<void>;
  } {
    const [execute] = useMutation(VerifyPhoneNumberMutation);

    return {
      execute: async args => {
        const {
          data,
          error,
        }: Partial<MutationResult<Pick<Mutation, "verifyPhoneNumber">>> = await execute({
          variables: args,
        });

        if (Boolean(error)) {
          throw error;
        }

        if (!Boolean(data?.verifyPhoneNumber)) {
          throw new Error("No pudimos verificar el SMS");
        }

        const {
          verifyPhoneNumber: { token },
        } = data as Pick<Mutation, "verifyPhoneNumber">;

        this.AuthTokenRepository.setAuthToken(token as string);
      },
    };
  }

  useSendEmailVerificationCodeMutation(): {
    execute: (args: MutationSendEmailVerificationCodeArgs) => Promise<void>;
  } {
    const [execute] = useMutation(SendEmailVerificationCodeMutation);

    return {
      execute: async args => {
        const {
          data,
          error,
        }: Partial<MutationResult<
          Pick<Mutation, "sendEmailVerificationCode">
        >> = await execute({
          variables: args,
        });

        if (Boolean(error)) {
          throw error;
        }

        if (!Boolean(data?.sendEmailVerificationCode)) {
          throw new Error("No pudimos enviar el correo.");
        }
      },
    };
  }

  useVerifyEmailMutation(): {
    execute: (args: MutationVerifyEmailArgs) => Promise<void>;
  } {
    const [execute] = useMutation(VerifyEmailMutation);

    return {
      execute: async args => {
        const {
          data,
          error,
        }: Partial<MutationResult<Pick<Mutation, "verifyEmail">>> = await execute({
          variables: args,
        });

        if (Boolean(error)) {
          throw error;
        }

        if (!Boolean(data?.verifyEmail)) {
          throw new Error("No pudimos verificar el correo electrónico.");
        }

        const {
          verifyEmail: { token },
        } = data as Pick<Mutation, "verifyEmail">;

        this.AuthTokenRepository.setAuthToken(token as string);
      },
    };
  }

  useSetPasswordMutation(): {
    execute: (args: MutationSetPasswordArgs) => Promise<void>;
  } {
    const [execute] = useMutation(SetPasswordMutation);

    return {
      execute: async args => {
        const {
          data,
          error,
        }: Partial<MutationResult<Pick<Mutation, "setPassword">>> = await execute({
          variables: args,
        });

        if (Boolean(error)) {
          throw error;
        }

        if (!Boolean(data?.setPassword)) {
          throw new Error("No pudimos crear tu contraseña");
        }

        const {
          setPassword: { token },
        } = data as Pick<Mutation, "setPassword">;

        this.AuthTokenRepository.setAuthToken(token as string);
      },
    };
  }

  useUploadGovernmentIDMutation(): {
    execute: (args: MutationUploadGovernmentIdArgs) => Promise<void>;
  } {
    const [execute] = useMutation(UploadGovernmentIDMutation);

    return {
      execute: async args => {
        const {
          data,
          error,
        }: Partial<MutationResult<Pick<Mutation, "uploadGovernmentID">>> = await execute({
          variables: args,
        });

        if (Boolean(error) || !Boolean(data?.uploadGovernmentID)) {
          throw new Error("No pudimos obtener tu DPI.");
        }

        const {
          uploadGovernmentID: { token },
        } = data as Pick<Mutation, "uploadGovernmentID">;

        this.AuthTokenRepository.setAuthToken(token as string);
      },
    };
  }

  useSetBankAccountMutation(): {
    execute: (args: MutationSetBankAccountArgs) => Promise<void>;
  } {
    const [execute] = useMutation(SetBankAccountMutation);

    return {
      execute: async args => {
        const message =
          "No pudimos vincular tu cuenta de banco. Revisa los campos e intenta de nuevo.";
        try {
          const {
            data,
            error,
          }: Partial<MutationResult<Pick<Mutation, "setBankAccount">>> = await execute({
            variables: args,
          });

          if (Boolean(error) || !Boolean(data?.setBankAccount)) {
            throw new Error(message);
          }

          const {
            setBankAccount: { token },
          } = data as Pick<Mutation, "setBankAccount">;

          this.AuthTokenRepository.setAuthToken(token as string);
        } catch (error) {
          throw new Error(message);
        }
      },
    };
  }

  useGetBanksByCountryQuery(): [
    (args: QueryGetBanksByCountryArgs) => Promise<void>,
    LazyQueryResult<Pick<Query, "getBanksByCountry">, QueryGetBanksByCountryArgs>,
  ] {
    const [execute, state] = useLazyQuery<
      Pick<Query, "getBanksByCountry">,
      QueryGetBanksByCountryArgs
    >(GetBanksByCountryQuery);

    const executeGetBanksByCountry = async (args: QueryGetBanksByCountryArgs) =>
      execute({ variables: args });

    return [executeGetBanksByCountry, state];
  }

  useGetCurrenciesByCountryQuery(): [
    (args: QueryGetCurrenciesByCountryArgs) => Promise<void>,
    LazyQueryResult<Pick<Query, "getCurrenciesByCountry">, QueryGetCurrenciesByCountryArgs>,
  ] {
    const [execute, state] = useLazyQuery<
      Pick<Query, "getCurrenciesByCountry">,
      QueryGetCurrenciesByCountryArgs
    >(GetCurrenciesByCountryQuery);

    const executeGetCurrenciesByCountry = async (args: QueryGetCurrenciesByCountryArgs) =>
      execute({ variables: args });

    return [executeGetCurrenciesByCountry, state];
  }
}
