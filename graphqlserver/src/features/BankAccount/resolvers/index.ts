import { IContext } from "../../../server/interfaces/IContext";
import {
  bankAccountRepositoryInjectionKey,
  guatemalaBankAccountRepositoryInjectionKey,
} from "../InjectionKeys";
import { getAdminBankAccounts } from "./getAdminBankAccounts";

export const queries = {
  getAdminBankAccounts,
};

export const types = {
  BankAccount: {
    currency: ({ id }, args, { dependencies }: IContext) => {
      const BankAccountRepository = dependencies.provide(bankAccountRepositoryInjectionKey);
      return BankAccountRepository.currency(id);
    },
    guatemala: ({ id }, args, { dependencies }: IContext) => {
      const BankAccountRepository = dependencies.provide(bankAccountRepositoryInjectionKey);
      return BankAccountRepository.guatemala(id);
    },
  },
  GuatemalaBankAccount: {
    bank: ({ id }, args, { dependencies }: IContext) => {
      const GuatemalaBankAccountRepository = dependencies.provide(
        guatemalaBankAccountRepositoryInjectionKey,
      );
      return GuatemalaBankAccountRepository.bank(id);
    },
  },
};
