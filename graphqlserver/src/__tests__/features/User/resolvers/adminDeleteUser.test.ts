import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import {
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import onboardAdminUser from "../../../../__test-utils__/helpers/onboardAdminUser";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import {
  mockEmailNotificationsRepository,
  mockEmailVerificationRepository,
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("adminDeleteUser", () => {
  const dependencies = new TestDependencies();
  const smsVerificationRepository = mockSMSVerificationRepository();
  const emailVerificationRepository = mockEmailVerificationRepository();
  const emailNotificationsRepository = mockEmailNotificationsRepository();
  dependencies.override(
    emailNotificationsRepositoryInjectionKey,
    _ => emailNotificationsRepository,
  );
  dependencies.override(
    smsVerificationRepositoryInjectionKey,
    _ => smsVerificationRepository,
  );
  dependencies.override(
    emailVerificationRepositoryInjectionKey,
    _ => emailVerificationRepository,
  );

  const server = new MockServer(dependencies);

  beforeAll(async () => {
    await server.start();
  });

  beforeEach(async () => {
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("success", async () => {
    const address = "u1@ibexcm.com";
    const password = "password";

    await onboardAdminUser({ address, password }, db);

    const {
      data: {
        adminAuthenticate: { token },
      },
    } = await GraphQLClient.adminAuthenticate({ args: { address, password } });

    const { user } = await onboardUser();

    const {
      data: { adminDeleteUser },
    } = await GraphQLClient.adminDeleteUser({ args: { id: user.id } }, token);

    expect(adminDeleteUser.id).toEqual(user.id);
  });

  test("failure: user does not exist", async () => {
    const address = "u1@ibexcm.com";
    const password = "password";

    await onboardAdminUser({ address, password }, db);

    const {
      data: {
        adminAuthenticate: { token },
      },
    } = await GraphQLClient.adminAuthenticate({ args: { address, password } });

    await expect(
      GraphQLClient.adminDeleteUser({ args: { id: "abc123" } }, token),
    ).rejects.toThrow();
  });

  test("failure: user is not an admin", async () => {
    const { user } = await onboardUser();

    await expect(
      GraphQLClient.adminDeleteUser({ args: { id: user.id } }, "token"),
    ).rejects.toThrow();
  });
});
