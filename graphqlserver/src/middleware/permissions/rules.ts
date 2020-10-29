import { BankAccount, GuatemalaDPI } from "@ibexcm/database";
import {
  MutationAdminAuthenticateArgs,
  MutationAuthenticateArgs,
  MutationCreateBitcoinAccountArgs,
  MutationSendEmailVerificationCodeArgs,
  MutationSetTransactionReceiptEvidenceArgs,
  MutationVerifyEmailArgs,
  QueryRecoverAccountArgs,
  TUserRole,
} from "@ibexcm/libraries/api";
import { compare } from "bcryptjs";
import { rule } from "graphql-shield";
import { AccountRecoveryError } from "../../features/AccountRecovery/errors/AccountRecoveryError";
import { AuthenticationError } from "../../features/Authentication/errors/AuthenticationError";
import { OnboardingError } from "../../features/Onboarding/errors/OnboardingError";
import { TransactionError } from "../../features/Transaction/errors/TransactionError";
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

export const isTransactionUser = rule({ cache: true })(
  async (
    parent,
    { args }: MutationSetTransactionReceiptEvidenceArgs,
    { dependencies, request: { auth } }: IContext,
    info,
  ) => {
    const db = dependencies.provide(dbInjectionKey);

    const senderUser = await db
      .transaction({ id: args.transactionID })
      .sender()
      .user();
    const recipientUser = await db
      .transaction({ id: args.transactionID })
      .recipient()
      .user();

    if (senderUser.id === auth.user.id || recipientUser.id === auth.user.id) {
      return true;
    }

    return TransactionError.invalidTransactionUser;
  },
);

export const isKYCApproved = rule({ cache: true })(
  async (
    parent,
    { args: { address } }: MutationAuthenticateArgs | MutationCreateBitcoinAccountArgs,
    { dependencies, request: { auth } }: IContext,
    { fieldName },
  ) => {
    const db = dependencies.provide(dbInjectionKey);
    let bankAccounts: BankAccount[] = [];
    let profileDocuments: GuatemalaDPI[] = [];

    if (fieldName === "authenticate") {
      bankAccounts = await db
        .email({ address })
        .contact()
        .user()
        .bankAccounts();

      profileDocuments = await db
        .email({ address })
        .contact()
        .user()
        .profile()
        .documents()
        .guatemala()
        .dpi();
    } else {
      bankAccounts = await db.user({ id: auth.user.id }).bankAccounts();

      profileDocuments = await db
        .user({ id: auth.user.id })
        .profile()
        .documents()
        .guatemala()
        .dpi();
    }

    if (
      bankAccounts.some(bankAccount => Boolean(bankAccount.verifiedAt)) &&
      profileDocuments.some(document => Boolean(document.verifiedAt))
    ) {
      return true;
    }

    if (
      bankAccounts.length <= 0 ||
      bankAccounts.every(bankAccount => !Boolean(bankAccount.verifiedAt))
    ) {
      return AuthenticationError.invalidBankAccountError;
    }

    if (
      profileDocuments.length <= 0 ||
      profileDocuments.every(document => !Boolean(document.verifiedAt))
    ) {
      return AuthenticationError.invalidProfileDocumentError;
    }

    return false;
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

export const isEmailAvailable = rule({ cache: true })(
  async (
    parent,
    { args: { address } }: MutationVerifyEmailArgs | MutationSendEmailVerificationCodeArgs,
    { dependencies }: IContext,
    info,
  ) => {
    const db = dependencies.provide(dbInjectionKey);

    const verifiedEmails = await db.emails({ where: { address, verifiedAt_not: null } });

    if (verifiedEmails.length > 0) {
      return OnboardingError.emailExistsError;
    }

    return true;
  },
);

export const isAccountRecoveryAvailable = rule({
  cache: true,
})(
  async (
    parent,
    { args: { address } }: QueryRecoverAccountArgs,
    { dependencies }: IContext,
    info,
  ) => {
    const db = dependencies.provide(dbInjectionKey);
    const emailExists = await db.emails({ where: { address, verifiedAt_not: null } });

    if (!Boolean(emailExists.length)) {
      return AccountRecoveryError.unregisteredEmailError;
    }

    return true;
  },
);
