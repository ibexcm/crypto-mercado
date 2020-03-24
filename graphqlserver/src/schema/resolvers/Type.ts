import { types as bankTypes } from "../../features/Bank/resolvers";
import { types as userTypes } from "../../features/User/resolvers";

export const Type = {
  ...bankTypes,
  ...userTypes,
};
