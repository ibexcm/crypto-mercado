import { ReadStream } from "fs";
import { IFileManagementRepository } from "../interfaces/IFileManagementRepository";

async function upload(
  bucketName: string,
  filename: string,
  stream: ReadStream,
): Promise<string> {
  return "path";
}

async function remove(bucketName: string, filename: string): Promise<boolean> {
  return true;
}

export const FileManagementRepository: IFileManagementRepository = {
  upload,
  remove,
};
