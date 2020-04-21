import { ReadStream } from "fs";

export interface IFileManagementRepository {
  upload(bucketName: string, filename: string, stream: ReadStream): Promise<string>;
  remove(bucketName: string, filename: string): Promise<boolean>;
}
