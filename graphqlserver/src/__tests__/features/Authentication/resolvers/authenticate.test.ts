import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { AuthenticationErrorCode } from "../../../../features/Authentication/errors/AuthenticationError";
import {
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../features/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../features/SMSVerification";
import adminKYCApproveUser from "../../../../__test-utils__/helpers/adminKYCApproveUser";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import {
  mockEmailNotificationsRepository,
  mockEmailVerificationRepository,
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("authenticate", () => {
  const dependencies = new TestDependencies();
  const smsVerificationRepository = mockSMSVerificationRepository();
  const emailVerificationRepository = mockEmailVerificationRepository();
  const emailNotificationsRepository = mockEmailNotificationsRepository();
  dependencies.override(
    smsVerificationRepositoryInjectionKey,
    _ => smsVerificationRepository,
  );
  dependencies.override(
    emailVerificationRepositoryInjectionKey,
    _ => emailVerificationRepository,
  );
  dependencies.override(
    emailNotificationsRepositoryInjectionKey,
    _ => emailNotificationsRepository,
  );

  const server = new MockServer(dependencies);

  beforeAll(async () => {
    await server.start();
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("authenticates user and returns session", async () => {
    const address = "u1@ibexcm.com";
    const password = "password";

    const { user } = await onboardUser({ address, password });

    await adminKYCApproveUser(user, db);

    const {
      data: { authenticate },
    } = await GraphQLClient.authenticate({ args: { address, password } });

    expect(authenticate.token).toBeDefined();
  });

  test("invalid password", async () => {
    const address = "u2@ibexcm.com";
    const password = "password";

    const { user } = await onboardUser({ address, password });

    await adminKYCApproveUser(user, db);

    const { errors } = await GraphQLClient.authenticate({
      args: { address, password: "invalid" },
    });

    expect(errors[0].extensions.code).toEqual(AuthenticationErrorCode.invalidPassword);
  });

  test("invalid username", async () => {
    const address = "u3@ibexcm.com";
    const password = "password";

    const { user } = await onboardUser({ address, password });

    await adminKYCApproveUser(user, db);

    const { errors } = await GraphQLClient.authenticate({
      args: { address: "invalid", password },
    });

    expect(errors[0].extensions.code).toEqual(AuthenticationErrorCode.invalidUsername);
  });

  test("KYC pending", async () => {
    const address = "u4@ibexcm.com";
    const password = "password";

    await onboardUser({ address, password });

    const { errors } = await GraphQLClient.authenticate({
      args: { address, password },
    });

    expect(errors[0].extensions.code).toEqual(AuthenticationErrorCode.invalidBankAccount);
  });
});
