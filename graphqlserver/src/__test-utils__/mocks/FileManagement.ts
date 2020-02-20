import { IFileManagementRepository } from "../../features/FileManagement";
import { ReadStream } from "fs";

export const mockFileManagementRepository = (): IFileManagementRepository => {
  return {
    upload: jest.fn(
      (bucketName: string, filename: string, stream: ReadStream) =>
        new Promise(resolve => resolve("http://thisisaurl.com")),
    ),
    remove: jest.fn(
      (bucketName: string, filename: string) => new Promise(resolve => resolve(true)),
    ),
  };
};
