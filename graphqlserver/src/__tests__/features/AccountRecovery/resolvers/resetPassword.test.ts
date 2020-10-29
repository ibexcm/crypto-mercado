import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../../../InjectionKeys";
import {
  MockServer,
  mockEmailAccountRecoveryRepository,
  mockEmailNotificationsRepository,
  mockEmailVerificationRepository,
} from "../../../../__test-utils__/mocks";
import {
  emailAccountRecoveryRepositoryInjectionKey,
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../libraries/EmailVerification";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";
import adminKYCApproveUser from "../../../../__test-utils__/helpers/adminKYCApproveUser";

describe("Reset Password", () => {
  const dependencies = new TestDependencies();

  dependencies.override(dbInjectionKey, _ => db);
  dependencies.override(emailAccountRecoveryRepositoryInjectionKey, _ =>
    mockEmailAccountRecoveryRepository(),
  );
  dependencies.override(emailNotificationsRepositoryInjectionKey, _ =>
    mockEmailNotificationsRepository(),
  );
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

  test("It should update user password by email and return a Session", async () => {
    const address = "u1@ibexcm.com";
    const password = "password";
    const newPassword = "secret";

    const { token, user } = await onboardUser({ address, password });
    await adminKYCApproveUser(user, db);

    const {
      data: { resetPassword },
    } = await GraphQLClient.resetPassword({ args: { password: newPassword } }, token);

    const {
      data: { authenticate },
    } = await GraphQLClient.authenticate({ args: { address, password: newPassword } });

    expect(resetPassword.token).toBeDefined();
    expect(authenticate.token).toBeDefined();
  });
});
