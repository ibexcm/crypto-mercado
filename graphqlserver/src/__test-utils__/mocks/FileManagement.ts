import { ReadStream } from "fs";
import { IFileManagementRepository } from "../../libraries/FileManagement";

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
