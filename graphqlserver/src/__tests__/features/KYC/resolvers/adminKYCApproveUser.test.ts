import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import Faker from "faker";
import { AuthenticationErrorCode } from "../../../../features/Authentication/errors/AuthenticationError";
import {
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import {
  getBankAccountArgs,
  getGovernmentIDArgs,
} from "../../../../__test-utils__/helpers/adminKYCApproveUser";
import onboardAdminUser from "../../../../__test-utils__/helpers/onboardAdminUser";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import {
  mockEmailNotificationsRepository,
  mockEmailVerificationRepository,
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("adminKYCApproveUser", () => {
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

  test("updates user profile verification document & bank account upon approval", async () => {
    const address = "u1@ibexcm.com";
    const password = "password";

    await onboardAdminUser({ address, password }, db);

    const {
      data: {
        adminAuthenticate: { token },
      },
    } = await GraphQLClient.adminAuthenticate({ args: { address, password } });

    const { user: pendingApprovalUser } = await onboardUser();
    const [{ id: documentID }] = await db
      .user({ id: pendingApprovalUser.id })
      .profile()
      .documents()
      .guatemala()
      .dpi();
    const [{ id: bankAccountID }] = await db
      .user({ id: pendingApprovalUser.id })
      .bankAccounts();

    const governmentIDArgs = getGovernmentIDArgs(documentID);
    const bankAccountArgs = getBankAccountArgs(bankAccountID);

    const {
      data: { adminKYCApproveUser },
    } = await GraphQLClient.adminKYCApproveUser(
      { userArgs: { id: pendingApprovalUser.id }, governmentIDArgs, bankAccountArgs },
      token,
    );

    expect(adminKYCApproveUser).toBe(true);

    const [document] = await db
      .user({ id: pendingApprovalUser.id })
      .profile()
      .documents()
      .guatemala()
      .dpi();
    expect(document.verifiedAt).toBeDefined();
    expect(document.firstName).toEqual(governmentIDArgs.firstName);
    expect(document.lastName).toEqual(governmentIDArgs.lastName);
    expect(document.CUI).toEqual(governmentIDArgs.CUI);
    expect(document.expiresAt).toBeDefined();
    expect(document.genre).toEqual(governmentIDArgs.genre);
    expect(document.dateOfBirth).toBeDefined();

    const [bankAccount] = await db.user({ id: pendingApprovalUser.id }).bankAccounts();
    expect(bankAccount.verifiedAt).toBeDefined();
  });

  test("fails when user is not ADMIN", async () => {
    const {
      data: {
        verifyPhoneNumber: { token },
      },
    } = await GraphQLClient.verifyPhoneNumber({
      args: { number: Faker.phone.phoneNumber(), code: "12345" },
    });

    const governmentIDArgs = getGovernmentIDArgs("123");
    const bankAccountArgs = getBankAccountArgs("123");

    await expect(
      GraphQLClient.adminKYCApproveUser(
        { userArgs: { id: "123" }, governmentIDArgs, bankAccountArgs },
        token,
      ),
    ).rejects.toThrowError(AuthenticationErrorCode.invalidAdminRole);
  });
});
