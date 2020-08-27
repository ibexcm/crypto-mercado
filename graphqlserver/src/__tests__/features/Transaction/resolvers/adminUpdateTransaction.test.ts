import { Currency, prisma as db, Transaction } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { config } from "../../../../config";
import { TransactionErrorCode } from "../../../../features/Transaction/errors/TransactionError";
import {
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import adminKYCApproveUser from "../../../../__test-utils__/helpers/adminKYCApproveUser";
import authenticate from "../../../../__test-utils__/helpers/authenticate";
import generateBitcoinAddress from "../../../../__test-utils__/helpers/generateBitcoinAddress";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import {
  mockEmailNotificationsRepository,
  mockEmailVerificationRepository,
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

const { adminAccountEmailAddress } = config.get("flags");

describe("adminUpdateTransaction", () => {
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

  test("updates USD to BTC transaction.", async () => {
    const { user: newUser, address, password } = await onboardUser();

    const { token: adminToken } = await adminKYCApproveUser(newUser, db, {
      address: adminAccountEmailAddress,
    });

    const { token } = await authenticate({ address, password });

    const bitcoinAddress = await generateBitcoinAddress();

    await GraphQLClient.createBitcoinAccount({ args: { address: bitcoinAddress } }, token);

    const {
      data: { user },
    } = await GraphQLClient.user(token);

    const [{ id: cryptoAccountID, currency }] = user.cryptoAccounts;

    const {
      data: { getAdminBankAccounts },
    } = await GraphQLClient.getAdminBankAccounts(token);

    const [adminBankAccount] = getAdminBankAccounts.filter(
      bankAccount => bankAccount.currency.symbol === CurrencySymbol.USD,
    );

    const {
      data: { createTransaction },
    } = await GraphQLClient.createTransaction(
      {
        args: {
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

    const transactionID = createTransaction.id;
    const amount = "100.00";
    const fee = { value: "1.5" };
    const exchangeRate = { price: "120000.00" };
    const tax = {
      value: "5",
    };

    const transactionHash = "transactionHash";

    const {
      data: { setTransactionReceiptEvidence },
    } = await GraphQLClient.setTransactionReceiptEvidence(
      {
        args: {
          transactionID,
          bitcoin: {
            transactionHash,
          },
        },
      },
      token,
    );

    const [
      {
        bitcoinReceipt: { id: cryptoEvidenceID },
      },
    ] = setTransactionReceiptEvidence.receipt.evidence;

    const cryptoEvidence = {
      id: cryptoEvidenceID,
      price: {
        value: 23.0,
      },
    };

    const {
      data: { adminUpdateTransaction },
    } = await GraphQLClient.adminUpdateTransaction(
      {
        args: {
          id: transactionID,
          amount,
          receipt: {
            exchangeRate,
            fee,
            tax,
            cryptoEvidence,
          },
        },
      },
      adminToken,
    );

    const {
      data: { getTransaction },
    } = await GraphQLClient.getTransaction(
      {
        args: {
          transactionID,
        },
      },
      adminToken,
    );

    expect(getTransaction.id).toEqual(transactionID);
    expect(getTransaction.amount).toEqual(amount);
    expect(getTransaction.receipt.exchangeRate.price).toEqual(exchangeRate.price);
    expect(getTransaction.receipt.exchangeRate.currency.symbol).toEqual(CurrencySymbol.USD);
    expect(getTransaction.receipt.fee.fee).toEqual(fee.value);
    expect(getTransaction.receipt.tax.tax).toEqual(tax.value);

    const [
      {
        bitcoinReceipt: {
          price: { value },
        },
      },
    ] = getTransaction.receipt.evidence;

    expect(value).toEqual(cryptoEvidence.price.value);
  });

  test("Marks transaction as paid.", async () => {
    const { user: newUser, address, password } = await onboardUser();

    const { token: adminToken } = await adminKYCApproveUser(newUser, db, {
      address: adminAccountEmailAddress,
    });

    const { token } = await authenticate({ address, password });

    const bitcoinAddress = await generateBitcoinAddress();

    await GraphQLClient.createBitcoinAccount({ args: { address: bitcoinAddress } }, token);

    const {
      data: { user },
    } = await GraphQLClient.user(token);

    const [{ id: cryptoAccountID }] = user.cryptoAccounts;

    const {
      data: { getAdminBankAccounts },
    } = await GraphQLClient.getAdminBankAccounts(token);

    const [adminBankAccount] = getAdminBankAccounts.filter(
      bankAccount => bankAccount.currency.symbol === CurrencySymbol.USD,
    );

    const {
      data: { createTransaction },
    } = await GraphQLClient.createTransaction(
      {
        args: {
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

    const transactionID = createTransaction.id;

    const paidAt = "2020-08-08T00:00:00.000Z";

    const {
      data: { adminUpdateTransaction },
    } = await GraphQLClient.adminUpdateTransaction(
      {
        args: {
          id: transactionID,
          receipt: {
            paidAt,
          },
        },
      },
      adminToken,
    );

    const {
      data: { getTransaction },
    } = await GraphQLClient.getTransaction(
      {
        args: {
          transactionID,
        },
      },
      adminToken,
    );

    expect(getTransaction.id).toEqual(transactionID);
    expect(getTransaction.receipt.paidAt).toEqual(paidAt);

    const [transaction, fromCurrency, toCurrency, clientID] = await Promise.all<
      Transaction,
      Currency,
      Currency,
      string
    >([
      db.transaction({ id: transactionID }),
      db
        .transaction({ id: transactionID })
        .receipt()
        .fromCurrency(),
      db
        .transaction({ id: transactionID })
        .receipt()
        .toCurrency(),
      db
        .transaction({ id: transactionID })
        .sender()
        .user()
        .account()
        .clientID(),
    ]);

    expect(
      emailNotificationsRepository.sendTransactionSuccessNotification,
    ).toHaveBeenCalledWith(address, {
      transaction,
      fromCurrencySymbol: fromCurrency.symbol,
      toCurrencySymbol: toCurrency.symbol,
      clientID,
      isFiatToCryptoTransaction: true,
    });
  });

  test("Fails on paid transaction.", async () => {
    const { user: newUser, address, password } = await onboardUser();

    const { token: adminToken } = await adminKYCApproveUser(newUser, db, {
      address: adminAccountEmailAddress,
    });

    const { token } = await authenticate({ address, password });

    const bitcoinAddress = await generateBitcoinAddress();

    await GraphQLClient.createBitcoinAccount({ args: { address: bitcoinAddress } }, token);

    const {
      data: { user },
    } = await GraphQLClient.user(token);

    const [{ id: cryptoAccountID }] = user.cryptoAccounts;

    const {
      data: { getAdminBankAccounts },
    } = await GraphQLClient.getAdminBankAccounts(token);

    const [adminBankAccount] = getAdminBankAccounts.filter(
      bankAccount => bankAccount.currency.symbol === CurrencySymbol.USD,
    );

    const {
      data: { createTransaction },
    } = await GraphQLClient.createTransaction(
      {
        args: {
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

    const transactionID = createTransaction.id;

    const paidAt = new Date();

    await GraphQLClient.adminUpdateTransaction(
      {
        args: {
          id: transactionID,
          receipt: {
            paidAt,
          },
        },
      },
      adminToken,
    );

    const { errors } = await GraphQLClient.adminUpdateTransaction(
      {
        args: {
          id: transactionID,
          receipt: {
            paidAt,
          },
        },
      },
      adminToken,
    );

    expect(errors[0].extensions.code).toEqual(TransactionErrorCode.transactionPaid);
  });
});
