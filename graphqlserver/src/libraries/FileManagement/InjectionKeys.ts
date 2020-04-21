import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { IFileManagementRepository } from "./interfaces/IFileManagementRepository";
import { FileManagementRepository } from "./repositories/FileManagementRepository";

export const fileManagementRepositoryInjectionKey: InjectionKey<IFileManagementRepository> = {
  name: "fileManager",
  scope: InjectionKeyScope.singleton,
  closure: _ => FileManagementRepository,
};
