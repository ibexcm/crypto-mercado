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

describe("adminGetUser", () => {
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
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("returns user", async () => {
    const address = "u1@ibexcm.com";
    const password = "password";

    await onboardAdminUser({ address, password }, db);

    const {
      data: {
        adminAuthenticate: { token },
      },
    } = await GraphQLClient.adminAuthenticate({ args: { address, password } });

    const length = 2;
    const [{ user: user1 }] = await Promise.all(
      new Array(length).fill(null).map(() => onboardUser()),
    );

    const {
      data: { adminGetUser: user },
    } = await GraphQLClient.adminGetUser({ args: { id: user1.id } }, token);

    expect(user.role.type).toEqual("CUSTOMER");
    expect(user.account.clientID).toBeDefined();
    expect(user.contact.email[0].address).toBeDefined();
    expect(user.profile.country.phoneNumberCode).toBeDefined();
    expect(user.profile.documents.guatemala.dpi[0].fileHash).toBeDefined();
    expect(user.bankAccounts[0].currency.name).toBeDefined();
    expect(user.bankAccounts[0].currency.symbol).toBeDefined();
    expect(user.bankAccounts[0].guatemala.accountNumber).toBeDefined();
    expect(user.bankAccounts[0].guatemala.fullName).toBeDefined();
    expect(user.bankAccounts[0].guatemala.bankAccountType).toBeDefined();
    expect(user.bankAccounts[0].guatemala.bank.name).toBeDefined();
  });
});
