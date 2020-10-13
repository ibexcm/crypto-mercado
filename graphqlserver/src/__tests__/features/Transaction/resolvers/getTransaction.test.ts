import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { config } from "../../../../config";
import { TransactionErrorCode } from "../../../../features/Transaction/errors/TransactionError";
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

describe("getTransaction", () => {
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
    const { user: newUser, address, password } = await onboardUser();

    await adminKYCApproveUser(newUser, db, { address: adminAccountEmailAddress });

    const { token } = await authenticate({ address, password });

    const {
      data: { user },
    } = await GraphQLClient.user(token);

    const [{ id: bankAccountID, currency }] = user.bankAccounts;
    const amount = "0.01234";

    const {
      data: {
        createTransaction: { id: transactionID },
      },
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

    const {
      data: { getTransaction },
    } = await GraphQLClient.getTransaction(
      {
        args: {
          transactionID,
        },
      },
      token,
    );

    expect(getTransaction.id).toBeDefined();
    expect(getTransaction.amount).toBeDefined();
    expect(getTransaction.createdAt).toBeDefined();
    expect(getTransaction.receipt.id).toBeDefined();
    expect(getTransaction.receipt.fee).toBeDefined();
    expect(getTransaction.receipt.tax).toBeDefined();
    expect(getTransaction.sender.id).toBeDefined();
    expect(getTransaction.recipient.id).toBeDefined();
    expect(getTransaction.recipient.cryptoAccount.bitcoin.address).toBeDefined();
    expect(getTransaction.recipient.cryptoAccount.currency.symbol).toBeDefined();
  });

  test("transaction does not exist", async () => {
    const { user: newUser, address, password } = await onboardUser();

    await adminKYCApproveUser(newUser, db, { address: adminAccountEmailAddress });

    const { token } = await authenticate({ address, password });

    const {
      data: { user },
    } = await GraphQLClient.user(token);

    const [{ id: bankAccountID, currency }] = user.bankAccounts;
    const amount = "0.01234";

    await expect(
      GraphQLClient.getTransaction(
        {
          args: {
            transactionID: "transactionID",
          },
        },
        token,
      ),
    ).rejects.toThrowError(TransactionErrorCode.transactionDoesNotExist);
  });
});
