import { prisma as db, Transaction } from "@ibexcm/database";
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

describe("setTransactionReceiptEvidence", () => {
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

  test("sets transaction bitcoinReceipt evidence", async () => {
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
          sender: {
            bankAccountID,
          },
        },
      },
      token,
    );

    const { id: transactionID } = createTransaction;
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

    const transactionReceiptEvidence = await db
      .transaction({ id: setTransactionReceiptEvidence.id })
      .receipt()
      .evidence();

    const [{ id: transactionReceiptEvidenceID }] = transactionReceiptEvidence;

    const transactionReceiptEvidenceTransaction = await db
      .transactionReceiptEvidence({ id: transactionReceiptEvidenceID })
      .transaction();

    const bitcoinReceiptEvidence = await db
      .transactionReceiptEvidence({ id: transactionReceiptEvidenceID })
      .bitcoinReceipt();

    expect(bitcoinReceiptEvidence.transactionHash).toEqual(transactionHash);
    expect(transactionReceiptEvidenceTransaction.id).toEqual(transactionID);

    const [transaction, clientID] = await Promise.all<Transaction, string>([
      db.transaction({ id: transactionID }),
      db
        .transaction({ id: transactionID })
        .sender()
        .user()
        .account()
        .clientID(),
    ]);

    expect(
      emailNotificationsRepository.sendAdminTransactionEvidenceSubmittedNotification,
    ).toHaveBeenCalledWith({ transaction, clientID });
  });

  test("sets transaction receipt bankReceipt evidence", async () => {
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

    const { id: transactionID } = createTransaction;
    const fileHash = "fileHash";

    const {
      data: { setTransactionReceiptEvidence },
    } = await GraphQLClient.setTransactionReceiptEvidence(
      {
        args: {
          transactionID,
          fiat: {
            fileHash,
          },
        },
      },
      adminToken,
    );

    const transactionReceiptEvidence = await db
      .transaction({ id: setTransactionReceiptEvidence.id })
      .receipt()
      .evidence();

    const [{ id: transactionReceiptEvidenceID }] = transactionReceiptEvidence;

    const transactionReceiptEvidenceTransaction = await db
      .transactionReceiptEvidence({ id: transactionReceiptEvidenceID })
      .transaction();

    const bankReceiptEvidence = await db
      .transactionReceiptEvidence({ id: transactionReceiptEvidenceID })
      .bankReceipt();

    expect(bankReceiptEvidence.fileHash).toEqual(fileHash);
    expect(transactionReceiptEvidenceTransaction.id).toEqual(transactionID);

    jest.clearAllMocks();
    expect(
      emailNotificationsRepository.sendAdminTransactionEvidenceSubmittedNotification,
    ).toHaveBeenCalledTimes(0);
  });

  test("invalidTransactionUser", async () => {
    const {
      user: senderUser,
      address: senderUserAddress,
      password: senderUserPassword,
    } = await onboardUser();
    const {
      user: anotherUser,
      address: anotherUserAddress,
      password: anotherUserPassword,
    } = await onboardUser();

    await adminKYCApproveUser(senderUser, db, {
      address: adminAccountEmailAddress,
    });

    await adminKYCApproveUser(anotherUser, db, {
      address: adminAccountEmailAddress,
    });

    const { token: senderUserToken } = await authenticate({
      address: senderUserAddress,
      password: senderUserPassword,
    });
    const { token: anotherUserToken } = await authenticate({
      address: anotherUserAddress,
      password: anotherUserPassword,
    });

    const {
      data: { user: senderUserData },
    } = await GraphQLClient.user(senderUserToken);

    const [{ id: bankAccountID }] = senderUserData.bankAccounts;
    const amount = "5000.00";

    const {
      data: { createTransaction },
    } = await GraphQLClient.createTransaction(
      {
        args: {
          amount,
          sender: {
            bankAccountID,
          },
        },
      },
      senderUserToken,
    );

    const { id: transactionID } = createTransaction;
    const transactionHash = "transactionHash";

    const { errors, data } = await GraphQLClient.setTransactionReceiptEvidence(
      {
        args: {
          transactionID,
          bitcoin: {
            transactionHash,
          },
        },
      },
      anotherUserToken,
    );

    expect(errors[0].extensions.code).toEqual(TransactionErrorCode.invalidTransactionUser);
    expect(data).toBeNull();
  });
});
