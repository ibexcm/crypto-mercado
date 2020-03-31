import { prisma as db } from "@ibexcm/database";
import { TGuatemalaBankAccount } from "@ibexcm/libraries/api";
import { TestDependencies } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../../../InjectionKeys";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import { transformGuatemalaAccountNumber } from "../../../../middleware/transforms/setBankAccount";
import {
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
  dependencies.override(dbInjectionKey, _ => db);
  dependencies.override(smsVerificationRepositoryInjectionKey, _ =>
    mockSMSVerificationRepository(),
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
    const number = "+00000000004";
    const {
      data: {
        verifyPhoneNumber: { token },
      },
    } = await GraphQLClient.verifyPhoneNumber({ args: { number, code } });

    const {
      data: {
        user: {
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
      .phoneNumber({ number })
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
  });
});
