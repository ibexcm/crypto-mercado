import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { config } from "../../../../config";
import {
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import onboardAdminUser from "../../../../__test-utils__/helpers/onboardAdminUser";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import setAdminBankAccounts from "../../../../__test-utils__/helpers/setAdminBankAccounts";
import {
  mockEmailNotificationsRepository,
  mockEmailVerificationRepository,
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

const { adminAccountEmailAddress } = config.get("flags");

describe("adminSettingsCreateExchangeRate", () => {
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
  });

  beforeEach(async () => {
    await db.deleteManyTransactions();
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("success", async () => {
    const users = await Promise.all(new Array(3).fill(null).map(_ => onboardUser()));

    const password = "password";

    await onboardAdminUser({ address: adminAccountEmailAddress, password }, db);

    const {
      data: {
        adminAuthenticate: { token: adminToken },
      },
    } = await GraphQLClient.adminAuthenticate({
      args: { address: adminAccountEmailAddress, password },
    });

    await setAdminBankAccounts(adminToken);

    const price = "7.50";

    const {
      data: { adminSettingsCreateExchangeRate },
    } = await GraphQLClient.adminSettingsCreateExchangeRate(
      {
        args: {
          price,
        },
      },
      adminToken,
    );

    const {
      data: { user },
    } = await GraphQLClient.user(adminToken);

    const [
      {
        currency: { symbol },
      },
    ] = user.bankAccounts;

    expect(adminSettingsCreateExchangeRate.price).toEqual(price);
    expect(adminSettingsCreateExchangeRate.currency.symbol).toEqual(symbol);
  });
});
