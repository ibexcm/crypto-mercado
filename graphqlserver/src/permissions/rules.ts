import {
  MutationSendVerificationCodeArgs,
  MutationVerifyPhoneNumberArgs,
} from "@ziina/libraries/api";
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

export const isAccount = rule({ cache: true })(
  async (parent, args, { dependencies, request: { auth } }: IContext, info) => {
    const db = dependencies.provide(dbInjectionKey);
    const accountExists =
      auth && auth.account && (await db.$exists.account({ id: auth.account.id }));

    if (!accountExists) {
      return UserError.invalidCredentialError;
    }

    return true;
  },
);

export const isPhoneNumberAvailable = rule({ cache: true })(
  async (
    parent,
    { number }: MutationVerifyPhoneNumberArgs | MutationSendVerificationCodeArgs,
    { dependencies }: IContext,
    info,
  ) => {
    const db = dependencies.provide(dbInjectionKey);
    const account = await db
      .phoneNumber({ number })
      .contact()
      .account();

    if (Boolean(account)) {
      return UserError.phoneNumberExistsError;
    }

    return true;
  },
);
