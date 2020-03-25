import { MutationAdminKycApproveUserArgs } from "@ibexcm/libraries/api";
import { IContext } from "../../../server/interfaces/IContext";
import { kycRepositoryInjectionKey } from "../InjectionKeys";

export async function adminKYCApproveUser(
  parent,
  args: MutationAdminKycApproveUserArgs,
  { dependencies, request }: IContext,
  info,
): Promise<Boolean> {
  const KYCRepository = dependencies.provide(kycRepositoryInjectionKey);
  return await KYCRepository.adminKYCApproveUser(args);
}
