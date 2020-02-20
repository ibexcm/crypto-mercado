import { InjectionKey, InjectionKeyScope } from "@ziina/libraries/di";
import { dbInjectionKey, loggerInjectionKey } from "../../InjectionKeys";
import { fileManagementRepositoryInjectionKey } from "../FileManagement";
import { sessionRepositoryInjectionKey } from "../Session";
import { smsVerificationRepositoryInjectionKey } from "../SMSVerification";
import { UserRepository } from "./repositories/UserRepository";

export const userRepositoryInjectionKey: InjectionKey<UserRepository> = {
  name: "userRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    const logger = dependencies.provide(loggerInjectionKey);
    const sessionRepository = dependencies.provide(sessionRepositoryInjectionKey);
    const smsVerificationRepository = dependencies.provide(
      smsVerificationRepositoryInjectionKey,
    );
    const fileManagementRepository = dependencies.provide(
      fileManagementRepositoryInjectionKey,
    );

    return new UserRepository(
      db,
      logger,
      sessionRepository,
      smsVerificationRepository,
      fileManagementRepository,
    );
  },
};
