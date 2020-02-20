import { prisma, User } from "@ziina/database";
import { Session } from "@ziina/libraries/api";
import fs, { ReadStream } from "fs";
import { FileUpload } from "graphql-upload";
import path from "path";
import {
  IFileManagementRepository,
  fileManagementRepositoryInjectionKey,
} from "../../../../features/FileManagement";
import { ISessionRepository } from "../../../../features/Session/interfaces/ISessionRepository";
import { ISMSVerificationRepository } from "../../../../features/SMSVerification";
import { UserError } from "../../../../features/User/errors/UserError";
import { UserRepository } from "../../../../features/User/repositories/UserRepository";
import { logger } from "../../../../server/utils/logger";
import { newUser } from "../../../../__test-utils__/mocks/User";
import { TestDependencies } from "@ziina/libraries/di";
import { userRepositoryInjectionKey } from "../../../../features/User/InjectionKeys";
import { mockFileManagementRepository } from "../../../../__test-utils__/mocks/FileManagement";

const token = "thisIsAToken";
const expiresAt = new Date();
const db = prisma;
const imageUploadError = "upload failed";
const username = "username";
const password = "password";
const phoneNumber = "+971000000000";

describe("UserRepository", () => {
  const dependencies = new TestDependencies();
  const fileManagementRepository = mockFileManagementRepository();
  dependencies.override(
    fileManagementRepositoryInjectionKey,
    _ => fileManagementRepository,
  );

  const userRepository = dependencies.provide(userRepositoryInjectionKey);

  beforeEach(async () => {
    await db.deleteManyAccounts();
  });
  test("setProfilePicture success", async () => {
    const filename1 = "mockProfilePicture1.png";
    const filename2 = "mockProfilePicture2.png";
    const filePath = (filename: string) =>
      path.join(__dirname, `../../../../__test-utils__/assets/${filename}`);
    await newUser(db, username, password, phoneNumber);

    const userID = await db
      .account({ username })
      .user()
      .id();

    const fileUpload1: FileUpload = {
      filename: filename1,
      mimetype: "mimetype",
      encoding: "encoding",
      createReadStream: () => fs.createReadStream(filePath(filename1)),
    };

    const url1 = await userRepository.setProfilePicture(fileUpload1, userID);
    expect(url1).toBeDefined();

    const profilePicture1 = await db.account({ username }).profilePicture();
    expect(profilePicture1.url).toEqual(url1);

    const fileUpload2: FileUpload = {
      filename: filename2,
      mimetype: "mimetype",
      encoding: "encoding",
      createReadStream: () => fs.createReadStream(filePath(filename2)),
    };

    await userRepository.setProfilePicture(fileUpload2, userID);

    const account = await db.account({ username });
    const profilePictures = await db.profilePictures({ where: { account: account } });
    expect(profilePictures).toHaveLength(1);
  });

  test("setProfilePicture upload failed", async () => {
    fileManagementRepository.upload = async () =>
      new Promise((resolve, reject) => reject(new Error(imageUploadError)));

    const username = "username";
    const filename = "mockProfilePicture1.png";
    const filePath = (filename: string) =>
      path.join(__dirname, `../../../../__test-utils__/assets/${filename}`);
    await newUser(db, username, password, phoneNumber);

    const userID = await db
      .account({ username })
      .user()
      .id();

    const fileUpload: FileUpload = {
      filename: filename,
      mimetype: "mimetype",
      encoding: "encoding",
      createReadStream: () => fs.createReadStream(filePath(filename)),
    };

    await expect(userRepository.setProfilePicture(fileUpload, userID)).rejects.toThrow(
      UserError.unableToSetProfilePicture(new Error(imageUploadError)),
    );
  });
});
