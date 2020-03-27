import {
  MutationAdminAuthenticateArgs,
  MutationAuthenticateArgs,
  MutationSendEmailVerificationCodeArgs,
  MutationSendPhoneNumberVerificationCodeArgs,
  MutationVerifyEmailArgs,
  MutationVerifyPhoneNumberArgs,
  TUserRole,
} from "@ibexcm/libraries/api";
import { compare } from "bcryptjs";
import { rule } from "graphql-shield";
import { AuthenticationError } from "../../features/Authentication/errors/AuthenticationError";
import { OnboardingError } from "../../features/Onboarding/errors/OnboardingError";
import { dbInjectionKey } from "../../InjectionKeys";
import { IContext } from "../../server/interfaces/IContext";

export const isUser = rule({ cache: true })(
  async (parent, args, { dependencies, request: { auth } }: IContext, info) => {
    const db = dependencies.provide(dbInjectionKey);
    return auth && auth.user && db.$exists.user({ id: auth.user.id });
  },
);

export const isAdmin = rule({ cache: true })(
  async (parent, args, { dependencies, request: { auth } }: IContext, info) => {
    const db = dependencies.provide(dbInjectionKey);

    if (!Boolean(auth) || !Boolean(auth.user)) {
      return new Error("Acceso restringido.");
    }

    const role = await db.user({ id: auth.user.id }).role();

    if (role.type !== TUserRole.Admin) {
      return AuthenticationError.invalidAdminRoleError;
    }

    return true;
  },
);

export const isKYCApproved = rule({ cache: true })(
  async (
    parent,
    { args: { address } }: MutationAuthenticateArgs,
    { dependencies, request: { auth } }: IContext,
    info,
  ) => {
    const db = dependencies.provide(dbInjectionKey);
    const bankAccounts = await db
      .email({ address })
      .contact()
      .user()
      .bankAccounts();

    if (bankAccounts.length <= 0) {
      return AuthenticationError.invalidBankAccountError;
    }

    if (bankAccounts.some(bankAccount => !Boolean(bankAccount.verifiedAt))) {
      return AuthenticationError.invalidBankAccountError;
    }

    const profileDocuments = await db
      .email({ address })
      .contact()
      .user()
      .profile()
      .documents()
      .guatemala()
      .dpi();

    if (profileDocuments.length <= 0) {
      return AuthenticationError.invalidProfileDocumentError;
    }

    if (profileDocuments.some(document => !Boolean(document.verifiedAt))) {
      return AuthenticationError.invalidProfileDocumentError;
    }

    return true;
  },
);

export const isValidPassword = rule({ cache: true })(
  async (
    parent,
    { args: { address, password } }: MutationAuthenticateArgs,
    { dependencies, request: { auth } }: IContext,
    info,
  ) => {
    const db = dependencies.provide(dbInjectionKey);
    const account = await db
      .email({ address })
      .contact()
      .user()
      .account();

    const isPasswordCorrect = await compare(password, account.password);
    if (!isPasswordCorrect) {
      return AuthenticationError.invalidPasswordError;
    }

    return true;
  },
);

export const isValidAdminAuthentication = rule({ cache: true })(
  async (
    parent,
    { args: { address, password } }: MutationAdminAuthenticateArgs,
    { dependencies, request: { auth } }: IContext,
    info,
  ) => {
    const db = dependencies.provide(dbInjectionKey);
    const role = await db
      .email({ address })
      .contact()
      .user()
      .role();

    if (role.type !== TUserRole.Admin) {
      return AuthenticationError.invalidAdminRoleError;
    }

    const account = await db
      .email({ address })
      .contact()
      .user()
      .account();

    const isPasswordCorrect = await compare(password, account.password);
    if (!isPasswordCorrect) {
      return AuthenticationError.invalidPasswordError;
    }

    return true;
  },
);

export const usernameExists = rule({ cache: true })(
  async (
    parent,
    { args: { address } }: MutationAuthenticateArgs,
    { dependencies, request: { auth } }: IContext,
    info,
  ) => {
    const db = dependencies.provide(dbInjectionKey);
    const account = await db
      .email({ address })
      .contact()
      .user()
      .account();

    if (!Boolean(account)) {
      return AuthenticationError.invalidUsernameError;
    }

    return true;
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
