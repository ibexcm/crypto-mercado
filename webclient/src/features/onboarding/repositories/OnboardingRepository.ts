import { MutationResult, useMutation } from "@apollo/client";
import {
  Mutation,
  MutationSendPhoneNumberVerificationCodeArgs,
  MutationVerifyPhoneNumberArgs,
} from "@ibexcm/libraries/api";
import {
  SendPhoneNumberVerificationCodeMutation,
  VerifyPhoneNumberMutation,
} from "@ibexcm/libraries/api/user";
import { AuthTokenRepository } from "../../authentication/repositories/AuthTokenRepository";

export class OnboardingRepository {
  private AuthTokenRepository: AuthTokenRepository;

  constructor(AuthTokenRepository: AuthTokenRepository) {
    this.AuthTokenRepository = AuthTokenRepository;
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
}
