import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { smsVerificationRepositoryInjectionKey } from "../../../../features/SMSVerification";
import { dbInjectionKey } from "../../../../InjectionKeys";
import {
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("sendPhoneNumberVerificationCode", () => {
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
      data: { sendPhoneNumberVerificationCode },
    } = await GraphQLClient.sendPhoneNumberVerificationCode({ args: { number } });

    expect(sendPhoneNumberVerificationCode).toBe(true);
  });

  test("phone number taken", async () => {});
});
