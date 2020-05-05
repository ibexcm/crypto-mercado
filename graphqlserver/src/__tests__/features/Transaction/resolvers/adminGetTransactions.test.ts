import { prisma as db } from "@ibexcm/database";
import { TransactionOrderByInput } from "@ibexcm/libraries/api";
import { TestDependencies } from "@ibexcm/libraries/di";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import { config } from "../../../../config";
import {
  emailNotificationsRepositoryInjectionKey,
  emailVerificationRepositoryInjectionKey,
} from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import {
  getBankAccountArgs,
  getGovernmentIDArgs,
} from "../../../../__test-utils__/helpers/adminKYCApproveUser";
import authenticate from "../../../../__test-utils__/helpers/authenticate";
import generateBitcoinAddress from "../../../../__test-utils__/helpers/generateBitcoinAddress";
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

describe("adminGetTransactions", () => {
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

    await Promise.all(
      users.map(async ({ user }) => {
        const [{ id: documentID }] = await db
          .user({ id: user.id })
          .profile()
          .documents()
          .guatemala()
          .dpi();

        const [{ id: bankAccountID }] = await db.user({ id: user.id }).bankAccounts();

        const governmentIDArgs = getGovernmentIDArgs(documentID);
        const bankAccountArgs = getBankAccountArgs(bankAccountID);

        await GraphQLClient.adminKYCApproveUser(
          { userArgs: { id: user.id }, governmentIDArgs, bankAccountArgs },
          adminToken,
        );
      }),
    );

    const authenticatedUsersTokens = await Promise.all(
      users.map(({ address, password }) => authenticate({ address, password })),
    );

    for (const { token } of authenticatedUsersTokens) {
      const bitcoinAddress = await generateBitcoinAddress();

      await GraphQLClient.createBitcoinAccount(
        { args: { address: bitcoinAddress } },
        token,
      );

      const {
        data: { user },
      } = await GraphQLClient.user(token);

      const [{ id: cryptoAccountID }] = user.cryptoAccounts;

      const {
        data: { getAdminBankAccounts },
      } = await GraphQLClient.getAdminBankAccounts(token);

      const [adminBankAccount] = getAdminBankAccounts.filter(
        bankAccount => bankAccount.currency.symbol === CurrencySymbol.GTQ,
      );

      const amount = "0.01234";

      await GraphQLClient.createTransaction(
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

      const [{ id: bankAccountID }] = user.bankAccounts;

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
    }

    const {
      data: { adminGetTransactions },
    } = await GraphQLClient.adminGetTransactions(
      {
        args: {
          where: { receipt: { paidAt: null } },
          orderBy: TransactionOrderByInput.CreatedAtDesc,
        },
      },
      adminToken,
    );

    expect(adminGetTransactions).toHaveLength(6);
  });
});
