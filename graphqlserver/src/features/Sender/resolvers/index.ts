import { IContext } from "../../../server/interfaces/IContext";
import { senderRepositoryInjectionKey } from "../InjectionKeys";

export const types = {
  Sender: {
    user: ({ id }, args, { dependencies }: IContext) => {
      const SenderRepository = dependencies.provide(senderRepositoryInjectionKey);
      return SenderRepository.user(id);
    },
    bankAccount: ({ id }, args, { dependencies }: IContext) => {
      const SenderRepository = dependencies.provide(senderRepositoryInjectionKey);
      return SenderRepository.bankAccount(id);
    },
    cryptoAccount: ({ id }, args, { dependencies }: IContext) => {
      const SenderRepository = dependencies.provide(senderRepositoryInjectionKey);
      return SenderRepository.cryptoAccount(id);
    },
  },
};
