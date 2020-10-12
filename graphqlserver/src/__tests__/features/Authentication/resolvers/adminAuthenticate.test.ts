import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { AuthenticationErrorCode } from "../../../../features/Authentication/errors/AuthenticationError";
import {
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import {
  mockEmailNotificationsRepository,
  mockEmailVerificationRepository,
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("adminAuthenticate", () => {
  const dependencies = new TestDependencies();
  const server = new MockServer(dependencies);
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

  beforeAll(async () => {
    await server.start();
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("authenticates admin user and returns session", async () => {
    const address = "u1@ibexcm.com";
    const password = "password";

    const { user } = await onboardUser({ address, password });

    await db.updateUser({
      where: {
        id: user.id,
      },
      data: {
        role: {
          connect: {
            type: "ADMIN",
          },
        },
      },
    });

    const {
      data: { adminAuthenticate },
    } = await GraphQLClient.adminAuthenticate({ args: { address, password } });

    expect(adminAuthenticate.token).toBeDefined();

    const {
      data: {
        user: { role },
      },
    } = await GraphQLClient.user(adminAuthenticate.token);

    expect(role.type).toEqual("ADMIN");
  });

  test("authenticate admin user fails: user is not an admin", async () => {
    const address = "u2@ibexcm.com";
    const password = "password";

    await onboardUser({ address, password });

    await expect(
      GraphQLClient.adminAuthenticate({
        args: { address, password },
      }),
    ).rejects.toThrowError(AuthenticationErrorCode.invalidAdminRole);
  });

  test("authenticate admin user fails: incorrect password", async () => {
    const address = "u3@ibexcm.com";
    const password = "password";

    const { user } = await onboardUser({ address, password });

    await db.updateUser({
      where: {
        id: user.id,
      },
      data: {
        role: {
          connect: {
            type: "ADMIN",
          },
        },
      },
    });

    await expect(
      GraphQLClient.adminAuthenticate({
        args: { address, password: "invalidpassword" },
      }),
    ).rejects.toThrowError(AuthenticationErrorCode.invalidPassword);
  });
});
