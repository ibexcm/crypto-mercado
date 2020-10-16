import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import Faker from "faker";
import { AuthenticationErrorCode } from "../../../../features/Authentication/errors/AuthenticationError";
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

describe("adminGetUsersWithPendingKYCApproval", () => {
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

  test("returns N number of users", async () => {
    const address = "u1@ibexcm.com";
    const password = "password";

    await onboardAdminUser({ address, password }, db);

    const {
      data: {
        adminAuthenticate: { token },
      },
    } = await GraphQLClient.adminAuthenticate({ args: { address, password } });

    const length = 10;
    await Promise.all(new Array(length).fill(null).map(() => onboardUser()));

    const {
      data: { adminGetUsersWithPendingKYCApproval },
    } = await GraphQLClient.adminGetUsersWithPendingKYCApproval(token);

    expect(adminGetUsersWithPendingKYCApproval).toHaveLength(length);

    for (const user of adminGetUsersWithPendingKYCApproval) {
      expect(user.role.type).toEqual("CUSTOMER");
      expect(user.account.clientID).toBeDefined();
      expect(user.contact.phoneNumber[0].number).toBeDefined();
      expect(user.contact.email[0].address).toBeDefined();
      expect(user.profile.country.phoneNumberCode).toBeDefined();
      expect(user.profile.documents.guatemala.dpi[0].fileHash).toBeDefined();
      expect(user.profile.documents.guatemala.dpi[0].verifiedAt).toBeNull();
      expect(user.bankAccounts[0].verifiedAt).toBeNull();
      expect(user.bankAccounts[0].currency.name).toBeDefined();
      expect(user.bankAccounts[0].currency.symbol).toBeDefined();
      expect(user.bankAccounts[0].guatemala.accountNumber).toBeDefined();
      expect(user.bankAccounts[0].guatemala.fullName).toBeDefined();
      expect(user.bankAccounts[0].guatemala.bankAccountType).toBeDefined();
      expect(user.bankAccounts[0].guatemala.bank.name).toBeDefined();
    }
  });

  test("returns only users who finished the onboarding process", async () => {
    const address = "u2@ibexcm.com";
    const password = "password";

    await onboardAdminUser({ address, password }, db);

    const {
      data: {
        adminAuthenticate: { token },
      },
    } = await GraphQLClient.adminAuthenticate({ args: { address, password } });

    const length = 5;
    await Promise.all(new Array(length).fill(null).map(() => onboardUser()));

    const {
      data: { adminGetUsersWithPendingKYCApproval },
    } = await GraphQLClient.adminGetUsersWithPendingKYCApproval(token);

    expect(adminGetUsersWithPendingKYCApproval).toHaveLength(length);
  });

  test("fails when user is not ADMIN", async () => {
    const address = "u3@ibexcm.com";
    const {
      data: {
        sendEmailVerificationCode: { token },
      },
    } = await GraphQLClient.sendEmailVerificationCode({
      args: { address },
    });

    await expect(
      GraphQLClient.adminGetUsersWithPendingKYCApproval(token),
    ).rejects.toThrowError(AuthenticationErrorCode.invalidAdminRole);
  });
});
