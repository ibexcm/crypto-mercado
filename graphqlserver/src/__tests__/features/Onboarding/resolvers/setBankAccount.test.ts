import { prisma as db } from "@ibexcm/database";
import { TGuatemalaBankAccount } from "@ibexcm/libraries/api";
import { TestDependencies } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../../../InjectionKeys";
import { emailNotificationsRepositoryInjectionKey } from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import { transformGuatemalaAccountNumber } from "../../../../middleware/transforms/setBankAccount";
import {
  mockEmailNotificationsRepository,
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("setBankAccount", () => {
  const code = "123456";
  const fullName = "Full Bank Account Name Pérez";
  const accountNumber = "01-234567-89";
  const bankAccountType = TGuatemalaBankAccount.Monetaria;
  const dependencies = new TestDependencies();
  const emailNotificationsRepository = mockEmailNotificationsRepository();
  dependencies.override(dbInjectionKey, _ => db);
  dependencies.override(smsVerificationRepositoryInjectionKey, _ =>
    mockSMSVerificationRepository(),
  );
  dependencies.override(
    emailNotificationsRepositoryInjectionKey,
    _ => emailNotificationsRepository,
  );

  const server = new MockServer(dependencies);

  beforeAll(async () => {
    await server.start();
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("creates bank account with currency, fullName, accountNumber, and bank & returns Session", async () => {
    const address = "u3@ibexcm.com";
    const {
      data: {
        sendEmailVerificationCode: { token },
      },
    } = await GraphQLClient.sendEmailVerificationCode({
      args: { address },
    });

    const {
      data: {
        user: {
          id: userID,
          profile: {
            country: { id: countryID },
          },
        },
      },
    } = await GraphQLClient.user(token);

    const {
      data: { getBanksByCountry },
    } = await GraphQLClient.getBanksByCountry({ args: { countryID } });

    const {
      data: { getCurrenciesByCountry },
    } = await GraphQLClient.getCurrenciesByCountry({ args: { countryID } });

    const [{ id: bankID }] = getBanksByCountry;
    const [{ id: currencyID }] = getCurrenciesByCountry;

    const {
      data: { setBankAccount },
    } = await GraphQLClient.setBankAccount(
      { args: { fullName, accountNumber, bankID, currencyID, bankAccountType } },
      token,
    );

    const bankAccounts = await db
      .email({ address })
      .contact()
      .user()
      .bankAccounts({ orderBy: "createdAt_DESC" });

    const currency = await db.bankAccount({ id: bankAccounts[0].id }).currency();
    const guatemalaBankAccount = await db
      .bankAccount({ id: bankAccounts[0].id })
      .guatemala();
    const bank = await db
      .bankAccount({ id: bankAccounts[0].id })
      .guatemala()
      .bank();

    expect(setBankAccount.token).toBeDefined();
    expect(bankAccounts).toHaveLength(1);
    expect(currency.id).toEqual(currencyID);
    expect(guatemalaBankAccount.fullName).toEqual(fullName);
    expect(guatemalaBankAccount.accountNumber).toEqual(
      transformGuatemalaAccountNumber(accountNumber),
    );
    expect(guatemalaBankAccount.bankAccountType).toEqual(bankAccountType);
    expect(bank.id).toEqual(bankID);

    const [clientID] = await Promise.all<string>([
      db
        .user({ id: userID })
        .account()
        .clientID(),
    ]);

    expect(
      emailNotificationsRepository.sendAdminCustomerOnboardingCompleteNotification,
    ).toHaveBeenCalledWith({ clientID });
  });
});
