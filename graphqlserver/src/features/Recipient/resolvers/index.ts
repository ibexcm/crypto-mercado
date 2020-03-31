import { IContext } from "../../../server/interfaces/IContext";
import { recipientRepositoryInjectionKey } from "../InjectionKeys";

export const types = {
  Recipient: {
    user: ({ id }, args, { dependencies }: IContext) => {
      const RecipientRepository = dependencies.provide(recipientRepositoryInjectionKey);
      return RecipientRepository.user(id);
    },
    bankAccount: ({ id }, args, { dependencies }: IContext) => {
      const RecipientRepository = dependencies.provide(recipientRepositoryInjectionKey);
      return RecipientRepository.bankAccount(id);
    },
    cryptoAccount: ({ id }, args, { dependencies }: IContext) => {
      const RecipientRepository = dependencies.provide(recipientRepositoryInjectionKey);
      return RecipientRepository.cryptoAccount(id);
    },
  },
};
