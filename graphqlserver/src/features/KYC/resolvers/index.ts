import { adminGetUsersWithPendingKYCApproval } from "./adminGetUsersWithPendingKYCApproval";
import { adminKYCApproveUser } from "./adminKYCApproveUser";
import { adminKYCRejectUser } from "./adminKYCRejectUser";

export const queries = {
  adminGetUsersWithPendingKYCApproval,
};

export const mutations = {
  adminKYCApproveUser,
  adminKYCRejectUser,
};
