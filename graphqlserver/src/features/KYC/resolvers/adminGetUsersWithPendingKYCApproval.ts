import { User } from "@ibexcm/database";
import { IContext } from "../../../server/interfaces/IContext";
import { kycRepositoryInjectionKey } from "../InjectionKeys";

export async function adminGetUsersWithPendingKYCApproval(
  parent,
  args,
  { dependencies, request }: IContext,
  info,
): Promise<User[]> {
  const KYCRepository = dependencies.provide(kycRepositoryInjectionKey);
  return await KYCRepository.adminGetUsersWithPendingKYCApproval();
}
