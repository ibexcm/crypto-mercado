import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { config } from "../../../../config";
import { ExchangeRateRepositoryInjectionKey } from "../../../../features/ExchangeRate/InjectionKeys";
import { BitcoinAPIRepositoryInjectionKey } from "../../../../libraries/Crypto/InjectionKeys";
import {
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import adminKYCApproveUser from "../../../../__test-utils__/helpers/adminKYCApproveUser";
import authenticate from "../../../../__test-utils__/helpers/authenticate";
import generateBitcoinAddress from "../../../../__test-utils__/helpers/generateBitcoinAddress";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import setAdminBankAccounts from "../../../../__test-utils__/helpers/setAdminBankAccounts";
import {
  mockEmailNotificationsRepository,
  mockEmailVerificationRepository,
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";
import MockBitcoinAPIRepository from "../../../../__test-utils__/mocks/MockBitcoinAPIRepository";

const { adminAccountEmailAddress } = config.get("flags");

describe("getTransactionBreakdown", () => {
  const dependencies = new TestDependencies();
  const smsVerificationRepository = mockSMSVerificationRepository();
  const emailVerificationRepository = mockEmailVerificationRepository();
  const emailNotificationsRepository = mockEmailNotificationsRepository();
  const bitcoinApiRepository = new MockBitcoinAPIRepository(
    dependencies.provide(ExchangeRateRepositoryInjectionKey),
  );

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
  dependencies.override(BitcoinAPIRepositoryInjectionKey, _ => bitcoinApiRepository);

  const server = new MockServer(dependencies);

  beforeAll(async () => {
    await server.start();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
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

    const [{ id: bankAccountID }] = user.bankAccounts;
    const amount = "0.01234";

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

    expect(bitcoinApiRepository.getCurrentPriceByCurrency).toHaveBeenCalledTimes(2);

    expect(getTransactionBreakdown.price.key).toBeDefined();
    expect(getTransactionBreakdown.price.value).toBeDefined();
    expect(getTransactionBreakdown.amount.key).toBeDefined();
    expect(getTransactionBreakdown.amount.value).toBeDefined();
    expect(getTransactionBreakdown.fee.key).toBeDefined();
    expect(getTransactionBreakdown.fee.value).toBeDefined();
    expect(getTransactionBreakdown.total.key).toBeDefined();
    expect(getTransactionBreakdown.total.value).toBeDefined();
    expect(getTransactionBreakdown.exchangeRate).toBeNull();
  });

  test("gets GTQ to BTC transaction breakdown: the user BUYS BTC with a GTQ bank deposit.", async () => {
    const { user: newUser, address, password } = await onboardUser();

    const { token: adminToken } = await adminKYCApproveUser(newUser, db, {
      address: adminAccountEmailAddress,
    });

    await setAdminBankAccounts(adminToken);

    const { token } = await authenticate({ address, password });

    await GraphQLClient.createBitcoinAccount(
      { args: { address: await generateBitcoinAddress() } },
      token,
    );

    const {
      data: { user },
    } = await GraphQLClient.user(token);

    const [{ id: cryptoAccountID }] = user.cryptoAccounts;
    const amount = "0.01234";

    const {
      data: { getAdminBankAccounts },
    } = await GraphQLClient.getAdminBankAccounts(token);

    const [adminBankAccount] = getAdminBankAccounts.filter(
      bankAccount => bankAccount.currency.symbol === CurrencySymbol.GTQ,
    );

    const {
      data: { getTransactionBreakdown },
    } = await GraphQLClient.getTransactionBreakdown(
      {
        args: {
          amount,
          sender: {
            cryptoAccountID,
          },
          recipient: {
            bankAccountID: adminBankAccount.id,
          },
        },
      },
      token,
    );

    expect(bitcoinApiRepository.getCurrentPriceByCurrency).toHaveBeenCalledTimes(2);

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
    expect(getTransactionBreakdown.exchangeRate).toBeDefined();
  });
});
