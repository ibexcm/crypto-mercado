import AWS, { AWSError } from "aws-sdk";
import { ReadStream } from "fs";
import { config } from "../../../config";
import { ManagedUpload, DeleteObjectOutput } from "aws-sdk/clients/s3";
import { IFileManagementRepository } from "../interfaces/IFileManagementRepository";

const { accessKeyId, secretAccessKey, region } = config.get("aws");
AWS.config.update({ accessKeyId, secretAccessKey, region });

const s3 = new AWS.S3();

async function upload(
  bucketName: string,
  filename: string,
  stream: ReadStream,
): Promise<string> {
  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: stream,
  };

  return new Promise<string>((resolve, reject) => {
    s3.upload(params, (err: AWSError, data: ManagedUpload.SendData) => {
      if (err || !data) {
        reject(err);
        return;
      }

      resolve(data.Location);
    });
  });
}

async function remove(bucketName: string, filename: string): Promise<boolean> {
  const params = {
    Bucket: bucketName,
    Key: filename,
  };

  return new Promise<boolean>((resolve, reject) => {
    s3.deleteObject(params, (err: AWSError, output: DeleteObjectOutput) => {
      resolve(!Boolean(err));
    });
  });
}

export const FileManagementRepository: IFileManagementRepository = {
  upload,
  remove,
};
