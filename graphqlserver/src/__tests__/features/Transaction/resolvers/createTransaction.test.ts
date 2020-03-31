import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { config } from "../../../../config";
import {
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import adminKYCApproveUser from "../../../../__test-utils__/helpers/adminKYCApproveUser";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import {
  mockEmailNotificationsRepository,
  mockEmailVerificationRepository,
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

const { adminAccountEmailAddress } = config.get("flags");

describe("createTransaction", () => {
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
    await db.deleteManyTransactions();
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("creates CRYPTO to FIAT transaction", async () => {
    const address = "u1@ibexcm.com";
    const password = "password";

    const { user: newUser } = await onboardUser({ address, password });

    await adminKYCApproveUser(newUser, db, { address: adminAccountEmailAddress });

    const {
      data: {
        authenticate: { token },
      },
    } = await GraphQLClient.authenticate({ args: { address, password } });

    const {
      data: { user },
    } = await GraphQLClient.user(token);

    const [{ id: bankAccountID, currency }] = user.bankAccounts;
    const amount = "5000.00";

    const {
      data: { createTransaction },
    } = await GraphQLClient.createTransaction(
      {
        args: {
          amount,
          bankAccountID,
        },
      },
      token,
    );

    const adminUser = await db
      .email({ address: adminAccountEmailAddress })
      .contact()
      .user();
    const [adminCryptoAccount] = await db.user({ id: adminUser.id }).cryptoAccounts();

    expect(createTransaction.amount).toEqual(amount);
    expect(createTransaction.receipt).toBeDefined();
    expect(createTransaction.sender).toBeDefined();
    expect(createTransaction.recipient).toBeDefined();

    expect(createTransaction.sender.id).toEqual(user.id);
    expect(createTransaction.recipient.id).toEqual(adminUser.id);

    expect(createTransaction.receipt.fromCurrency).toBeDefined();
    expect(createTransaction.receipt.toCurrency).toBeDefined();
    expect(createTransaction.receipt.toCurrency.symbol).toEqual(currency.symbol);
    expect(createTransaction.receipt.fromCurrency).toBeDefined();
    expect(createTransaction.receipt.fromCurrency.symbol).toEqual(
      adminCryptoAccount.currency.symbol,
    );
  });
});
