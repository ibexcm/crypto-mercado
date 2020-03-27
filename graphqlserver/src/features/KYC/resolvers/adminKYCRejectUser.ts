import { MutationAdminKycRejectUserArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { kycRepositoryInjectionKey } from "../InjectionKeys";

export async function adminKYCRejectUser(
  parent,
  args: MutationAdminKycRejectUserArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Boolean> {
  const KYCRepository = dependencies.provide(kycRepositoryInjectionKey);
  return await KYCRepository.adminKYCRejectUser(args);
}
