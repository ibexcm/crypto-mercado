import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../../../InjectionKeys";
import { emailVerificationRepositoryInjectionKey } from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import {
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import { mockEmailVerificationRepository } from "../../../../__test-utils__/mocks/EmailVerification";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("sendEmailVerificationCode", () => {
  const address = "u1@ibexcm.com";
  const number = "+50200000000";
  const code = "123456";

  const dependencies = new TestDependencies();
  dependencies.override(dbInjectionKey, _ => db);
  const smsVerificationRepository = mockSMSVerificationRepository();
  dependencies.override(emailVerificationRepositoryInjectionKey, _ =>
    mockEmailVerificationRepository(),
  );
  dependencies.override(
    smsVerificationRepositoryInjectionKey,
    _ => smsVerificationRepository,
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
        sendEmailVerificationCode: { token, state },
      },
    } = await GraphQLClient.sendEmailVerificationCode({ args: { address } });

    expect(state).toBe(true);
    expect(token).toBeDefined();
  });

  test("email address taken", async () => {});
});
