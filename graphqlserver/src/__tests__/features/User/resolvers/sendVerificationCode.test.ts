import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { smsVerificationRepositoryInjectionKey } from "../../../../features/SMSVerification";
import { dbInjectionKey } from "../../../../InjectionKeys";
import {
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("sendVerificationCode", () => {
  const number = "+50200000000";
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

  test("success", async () => {
    const {
      data: {
        data: { sendVerificationCode },
      },
    } = await GraphQLClient.sendVerificationCode({ args: { number } });

    expect(sendVerificationCode).toBe(true);
  });

  test("phone number taken", async () => {});
});
