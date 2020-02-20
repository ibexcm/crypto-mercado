import {
  MutationSendVerificationCodeArgs,
  MutationVerifyPhoneNumberArgs,
} from "@ibexcm/libraries/api";
import { rule } from "graphql-shield";
import { UserError } from "../features/User/errors/UserError";
import { dbInjectionKey } from "../InjectionKeys";
import { IContext } from "../server/interfaces/IContext";

export const isUser = rule({ cache: true })(
  async (parent, args, { dependencies, request: { auth } }: IContext, info) => {
    const db = dependencies.provide(dbInjectionKey);
    return auth && auth.user && db.$exists.user({ id: auth.user.id });
  },
);

export const isPhoneNumberAvailable = rule({ cache: true })(
  async (
    parent,
    { args: { number } }: MutationVerifyPhoneNumberArgs | MutationSendVerificationCodeArgs,
    { dependencies }: IContext,
    info,
  ) => {
    const db = dependencies.provide(dbInjectionKey);
    const user = await db
      .phoneNumber({ number })
      .contact()
      .user();

    if (Boolean(user)) {
      return UserError.phoneNumberExistsError;
    }

    return true;
  },
);
