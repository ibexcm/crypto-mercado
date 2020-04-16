import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { config } from "../../../../config";
import {
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import adminKYCApproveUser from "../../../../__test-utils__/helpers/adminKYCApproveUser";
import authenticate from "../../../../__test-utils__/helpers/authenticate";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import {
  mockEmailNotificationsRepository,
  mockEmailVerificationRepository,
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

const { adminAccountEmailAddress } = config.get("flags");

describe("getTransactionBreakdown", () => {
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

  test("gets BTC to USD transaction breakdown: the user SELLS BTC and EXPECTS a USD bank deposit.", async () => {
    const { user: newUser, address, password } = await onboardUser();

    await adminKYCApproveUser(newUser, db, { address: adminAccountEmailAddress });

    const { token } = await authenticate({ address, password });

    const {
      data: { user },
    } = await GraphQLClient.user(token);

    const [{ id: bankAccountID, currency }] = user.bankAccounts;
    const amount = "0.01234";

    await GraphQLClient.createTransaction(
      {
        args: {
          amount,
          sender: {
            bankAccountID,
          },
        },
      },
      token,
    );

    const {
      data: { getTransactionBreakdown },
    } = await GraphQLClient.getTransactionBreakdown(
      {
        args: {
          amount,
          sender: {
            bankAccountID,
          },
        },
      },
      token,
    );

    expect(getTransactionBreakdown.price.key).toBeDefined();
    expect(getTransactionBreakdown.price.value).toBeDefined();
    expect(getTransactionBreakdown.amount.key).toBeDefined();
    expect(getTransactionBreakdown.amount.value).toBeDefined();
    expect(getTransactionBreakdown.fee.key).toBeDefined();
    expect(getTransactionBreakdown.fee.value).toBeDefined();
    expect(getTransactionBreakdown.tax.key).toBeDefined();
    expect(getTransactionBreakdown.tax.value).toBeDefined();
    expect(getTransactionBreakdown.total.key).toBeDefined();
    expect(getTransactionBreakdown.total.value).toBeDefined();
    expect(getTransactionBreakdown.exchangeRate).toBeNull();
  });
});
