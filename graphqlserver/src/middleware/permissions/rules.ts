import {
  MutationSendEmailVerificationCodeArgs,
  MutationSendPhoneNumberVerificationCodeArgs,
  MutationVerifyEmailArgs,
  MutationVerifyPhoneNumberArgs,
} from "@ibexcm/libraries/api";
import { rule } from "graphql-shield";
import { OnboardingError } from "../../features/Onboarding/errors/OnboardingError";
import { dbInjectionKey } from "../../InjectionKeys";
import { IContext } from "../../server/interfaces/IContext";

export const isUser = rule({ cache: true })(
  async (parent, args, { dependencies, request: { auth } }: IContext, info) => {
    const db = dependencies.provide(dbInjectionKey);
    return auth && auth.user && db.$exists.user({ id: auth.user.id });
  },
);

export const isPhoneNumberAvailable = rule({ cache: true })(
  async (
    parent,
    {
      args: { number },
    }: MutationVerifyPhoneNumberArgs | MutationSendPhoneNumberVerificationCodeArgs,
    { dependencies }: IContext,
    info,
  ) => {
    const db = dependencies.provide(dbInjectionKey);
    const user = await db
      .phoneNumber({ number })
      .contact()
      .user();

    if (Boolean(user)) {
      return OnboardingError.phoneNumberExistsError;
    }

    return true;
  },
);

export const isEmailAvailable = rule({ cache: true })(
  async (
    parent,
    { args: { address } }: MutationVerifyEmailArgs | MutationSendEmailVerificationCodeArgs,
    { dependencies }: IContext,
    info,
  ) => {
    const db = dependencies.provide(dbInjectionKey);
    const user = await db
      .email({ address })
      .contact()
      .user();

    if (Boolean(user)) {
      return OnboardingError.emailExistsError;
    }

    return true;
  },
);
