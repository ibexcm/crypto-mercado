import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";

export const types = {
  User: {
    role: ({ id }, args, { dependencies }: IContext) => {
      const UserRepository = dependencies.provide(userRepositoryInjectionKey);
      return UserRepository.role(id);
    },
    account: ({ id }, args, { dependencies }: IContext) => {
      const UserRepository = dependencies.provide(userRepositoryInjectionKey);
      return UserRepository.account(id);
    },
    contact: ({ id }, args, { dependencies }: IContext) => {
      const UserRepository = dependencies.provide(userRepositoryInjectionKey);
      return UserRepository.contact(id);
    },
    profile: ({ id }, args, { dependencies }: IContext) => {
      const UserRepository = dependencies.provide(userRepositoryInjectionKey);
      return UserRepository.profile(id);
    },
    bankAccounts: ({ id }, args, { dependencies }: IContext) => {
      const UserRepository = dependencies.provide(userRepositoryInjectionKey);
      return UserRepository.bankAccounts(id);
    },
  },
};
