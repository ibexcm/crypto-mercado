import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { fileManagementRepositoryInjectionKey } from "../FileManagement";
import { sessionRepositoryInjectionKey } from "../Session";
import { smsVerificationRepositoryInjectionKey } from "../SMSVerification";
import { UserRepository } from "./repositories/UserRepository";

export const userRepositoryInjectionKey: InjectionKey<UserRepository> = {
  name: "userRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    const sessionRepository = dependencies.provide(sessionRepositoryInjectionKey);
    const smsVerificationRepository = dependencies.provide(
      smsVerificationRepositoryInjectionKey,
    );
    const fileManagementRepository = dependencies.provide(
      fileManagementRepositoryInjectionKey,
    );

    return new UserRepository(
      db,
      sessionRepository,
      smsVerificationRepository,
      fileManagementRepository,
    );
  },
};
