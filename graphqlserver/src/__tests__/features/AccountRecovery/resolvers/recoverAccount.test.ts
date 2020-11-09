import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { AccountRecoveryErrorCode } from "../../../../features/AccountRecovery/errors/AccountRecoveryError";
import {
  emailAccountRecoveryRepositoryInjectionKey,
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../libraries/EmailVerification";
import adminKYCApproveUser from "../../../../__test-utils__/helpers/adminKYCApproveUser";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import {
  mockEmailAccountRecoveryRepository,
  mockEmailNotificationsRepository,
  mockEmailVerificationRepository,
  MockServer,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("recoverAccount", () => {
  const dependencies = new TestDependencies();
  const emailAccountRecoveryRepository = mockEmailAccountRecoveryRepository();
  const emailVerificationRepository = mockEmailVerificationRepository();
  const emailNotificationsRepository = mockEmailNotificationsRepository();

  dependencies.override(
    emailVerificationRepositoryInjectionKey,
    _ => emailVerificationRepository,
  );

  dependencies.override(
    emailNotificationsRepositoryInjectionKey,
    _ => emailNotificationsRepository,
  );

  dependencies.override(
    emailAccountRecoveryRepositoryInjectionKey,
    _ => emailAccountRecoveryRepository,
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

  test("Should Send an email and return true", async () => {
    const address = "gustavoandresibarra@gmail.com";
    const password = "password";

    const { user } = await onboardUser({ address, password });
    await adminKYCApproveUser(user, db);

    const {
      data: { recoverAccount },
    } = await GraphQLClient.recoverAccount({
      args: {
        address,
      },
    });

    expect(recoverAccount).toBeDefined();
    expect(recoverAccount).toBe(true);
  });

  test("Should throw an error with code unregisteredEmail", async () => {
    const address = "usr1@ibexcm.org";

    await expect(
      GraphQLClient.recoverAccount({
        args: {
          address,
        },
      }),
    ).rejects.toThrowError(AccountRecoveryErrorCode.unregisteredEmail);
  });
});
