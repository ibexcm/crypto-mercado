import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import IpfsClient from "@ibexcm/libraries/ipfs/client";
import FormData from "form-data";
import fs from "fs";
import { promisify } from "util";
import { smsVerificationRepositoryInjectionKey } from "../../../../features/SMSVerification";
import { dbInjectionKey } from "../../../../InjectionKeys";
import {
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("uploadGovernmentID", () => {
  const code = "123456";
  const dependencies = new TestDependencies();
  dependencies.override(dbInjectionKey, _ => db);
  dependencies.override(smsVerificationRepositoryInjectionKey, _ =>
    mockSMSVerificationRepository(),
  );

  const server = new MockServer(dependencies);

  beforeAll(async () => {
    await server.start();
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("creates profile.governmentID.GTQ_DPI.fileHash & returns Session", async () => {
    const number = "+0000000001";
    const {
      data: {
        verifyPhoneNumber: { token },
      },
    } = await GraphQLClient.verifyPhoneNumber({ args: { number, code } });

    const readFile = promisify(fs.readFile);
    const file = await readFile(
      `${__dirname}/../../../../__test-utils__/assets/mockProfilePicture2.png`,
    );

    const data = new FormData();
    data.append("mockProfilePicture2.png", file, { contentType: "image/png" });

    const {
      data: { Hash: fileHash },
    } = await IpfsClient(data, {
      "only-hash": true,
    });

    const {
      data: { uploadGovernmentID },
    } = await GraphQLClient.uploadGovernmentID({ args: { fileHash } }, token);

    const [{ id }] = await db
      .phoneNumber({ number })
      .contact()
      .user()
      .profile()
      .documents()
      .guatemala()
      .dpi({
        orderBy: "createdAt_DESC",
      });

    const guatemalaDPI = await db.guatemalaDPI({
      id,
    });

    expect(uploadGovernmentID.token).toBeDefined();
    expect(guatemalaDPI.fileHash).toBeDefined();
  });
});
