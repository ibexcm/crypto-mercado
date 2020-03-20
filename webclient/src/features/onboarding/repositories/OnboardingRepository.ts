import { MutationResult, useMutation } from "@apollo/client";
import {
  Mutation,
  MutationSendEmailVerificationCodeArgs,
  MutationSendPhoneNumberVerificationCodeArgs,
  MutationSetPasswordArgs,
  MutationUploadGovernmentIdArgs,
  MutationVerifyEmailArgs,
  MutationVerifyPhoneNumberArgs,
} from "@ibexcm/libraries/api";
import {
  SendEmailVerificationCodeMutation,
  SendPhoneNumberVerificationCodeMutation,
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
}
