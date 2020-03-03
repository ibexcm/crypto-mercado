import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { emailVerificationRepositoryInjectionKey } from "../../../../features/EmailVerification";
import { dbInjectionKey } from "../../../../InjectionKeys";
import { MockServer } from "../../../../__test-utils__/mocks";
import { mockEmailVerificationRepository } from "../../../../__test-utils__/mocks/EmailVerification";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("sendEmailVerificationCode", () => {
  const address = "u1@ibexcm.com";
  const dependencies = new TestDependencies();
  dependencies.override(dbInjectionKey, _ => db);
  dependencies.override(emailVerificationRepositoryInjectionKey, _ =>
    mockEmailVerificationRepository(),
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
      data: { sendEmailVerificationCode },
    } = await GraphQLClient.sendEmailVerificationCode({ args: { address } });

    expect(sendEmailVerificationCode).toBe(true);
  });

  test("email address taken", async () => {});
});
