import { forwardTo } from "prisma-binding";
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
};
