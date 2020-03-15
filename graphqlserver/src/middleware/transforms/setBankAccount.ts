import { MutationSetBankAccountArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../server/interfaces/IContext";

export function transformGuatemalaAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/[\W_]+/g, "");
}

export default (
  resolve,
  root,
  input: MutationSetBankAccountArgs,
  context: IContext,
  info,
) => {
  input.args.accountNumber = transformGuatemalaAccountNumber(input.args.accountNumber);
  return resolve(root, input, context, info);
};
