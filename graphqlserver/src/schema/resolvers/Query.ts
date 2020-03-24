import { forwardTo } from "prisma-binding";
import { queries as bankQueries } from "../../features/Bank/resolvers";
import { queries as currencyQueries } from "../../features/Currency/resolvers";
import { queries as kycQueries } from "../../features/KYC/resolvers";
import { IContext } from "../../server/interfaces/IContext";

export const Query = {
  user: (parent, args, context: IContext, info) => {
    return forwardTo("binding")(
      parent,
      {
        where: {
          ...context.request.auth.user,
          ...args,
        },
      },
      context,
      info,
    );
  },
  ...bankQueries,
  ...currencyQueries,
  ...kycQueries,
};
