import { forwardTo } from "prisma-binding";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";
import { adminDeleteUser } from "./adminDeleteUser";
import { adminGetUser } from "./adminGetUser";
import { adminGetUsers } from "./adminGetUsers";

export const queries = {
  user: (parent, args, context: IContext, info) => {
    return forwardTo("binding")(
      parent,
      {
        where: {
          ...context.request.auth.user,
        },
      },
      context,
      info,
    );
  },
  adminGetUser,
  adminGetUsers,
};

export const mutations = {
  adminDeleteUser,
};

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
    transactions: ({ id }, args, { dependencies }: IContext) => {
      const UserRepository = dependencies.provide(userRepositoryInjectionKey);
      return UserRepository.transactions(id, args);
    },
  },
  Profile: {
    documents: ({ id }, args, { dependencies }: IContext) => {
      const UserRepository = dependencies.provide(userRepositoryInjectionKey);
      return UserRepository.documents(id);
    },
  },
  ProfileDocument: {
    guatemala: ({ id }, args, { dependencies }: IContext) => {
      const UserRepository = dependencies.provide(userRepositoryInjectionKey);
      return UserRepository.guatemala(id);
    },
  },
  GuatemalaDocument: {
    dpi: ({ id }, args, { dependencies }: IContext) => {
      const UserRepository = dependencies.provide(userRepositoryInjectionKey);
      return UserRepository.dpi(id);
    },
  },
};
