import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import Faker from "faker";
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

  test("creates BITCOIN to FIAT transaction: the user SELLS BTC and EXPECTS a bank deposit.", async () => {
    const { user: newUser, address, password } = await onboardUser();

    await adminKYCApproveUser(newUser, db, { address: adminAccountEmailAddress });

    const { token } = await authenticate({ address, password });

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

    const adminCryptoAccountCurrency = await db
      .cryptoAccount({ id: adminCryptoAccount.id })
      .currency();

    expect(createTransaction.amount).toEqual(amount);
    expect(createTransaction.receipt).toBeDefined();
    expect(createTransaction.sender).toBeDefined();
    expect(createTransaction.recipient).toBeDefined();

    expect(createTransaction.sender.user.id).toEqual(user.id);
    expect(createTransaction.sender.bankAccount.id).toEqual(bankAccountID);

    expect(createTransaction.recipient.user.id).toEqual(adminUser.id);
    expect(createTransaction.recipient.cryptoAccount.id).toEqual(adminCryptoAccount.id);

    expect(createTransaction.receipt.toCurrency).toBeDefined();
    expect(createTransaction.receipt.fromCurrency).toBeDefined();
    expect(createTransaction.receipt.toCurrency.symbol).toEqual(currency.symbol);
    expect(createTransaction.receipt.fromCurrency.symbol).toEqual(
      adminCryptoAccountCurrency.symbol,
    );
  });

  test("creates FIAT to BITCOIN transaction: the user EXPECTS BTC and SENDS a bank deposit.", async () => {
    const { user: newUser, address, password } = await onboardUser();

    await adminKYCApproveUser(newUser, db, { address: adminAccountEmailAddress });

    const { token } = await authenticate({ address, password });

    const bitcoinAddress = Faker.finance.bitcoinAddress();

    const {
      data: { createBitcoinAccount },
    } = await GraphQLClient.createBitcoinAccount(
      { args: { address: bitcoinAddress } },
      token,
    );

    const {
      data: { user },
    } = await GraphQLClient.user(token);

    const [{ id: cryptoAccountID, currency }] = user.cryptoAccounts;

    const {
      data: { createTransaction },
    } = await GraphQLClient.createTransaction(
      {
        args: {
          cryptoAccountID,
        },
      },
      token,
    );

    const adminUser = await db
      .email({ address: adminAccountEmailAddress })
      .contact()
      .user();

    const [adminBankAccount] = await db.user({ id: adminUser.id }).bankAccounts();

    const adminBankAccountCurrency = await db
      .bankAccount({ id: adminBankAccount.id })
      .currency();

    expect(createTransaction.amount).toEqual("0.00");
    expect(createTransaction.receipt).toBeDefined();
    expect(createTransaction.sender).toBeDefined();
    expect(createTransaction.recipient).toBeDefined();

    expect(createTransaction.sender.user.id).toEqual(user.id);
    expect(createTransaction.sender.cryptoAccount.id).toEqual(cryptoAccountID);

    expect(createTransaction.recipient.user.id).toEqual(adminUser.id);
    expect(createTransaction.recipient.bankAccount.id).toEqual(adminBankAccount.id);

    expect(createTransaction.receipt.toCurrency).toBeDefined();
    expect(createTransaction.receipt.fromCurrency).toBeDefined();
    expect(createTransaction.receipt.toCurrency.symbol).toEqual(currency.symbol);
    expect(createTransaction.receipt.fromCurrency.symbol).toEqual(
      adminBankAccountCurrency.symbol,
    );
  });
});
