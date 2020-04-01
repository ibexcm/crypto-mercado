import { MutationCreateBitcoinAccountArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { cryptoAccountRepositoryInjectionKey } from "../InjectionKeys";

export async function createBitcoinAccount(
  parent,
  args: MutationCreateBitcoinAccountArgs,
  { dependencies, request }: IContext,
  info,
): Promise<boolean> {
  const CryptoAccountRepository = dependencies.provide(cryptoAccountRepositoryInjectionKey);
  return await CryptoAccountRepository.createBitcoinAccount(args, request.auth.user);
}
