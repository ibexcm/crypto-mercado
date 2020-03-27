import { prisma as db } from "@ibexcm/database";
import { AdminKycApproveUserBankAccountInput, AdminKycApproveUserGovernmentIdInput, TGenre } from "@ibexcm/libraries/api";
import { TestDependencies } from "@ibexcm/libraries/di";
import Faker from "faker";
import { AuthenticationErrorCode } from "../../../../features/Authentication/errors/AuthenticationError";
import { emailNotificationsRepositoryInjectionKey, emailVerificationRepositoryInjectionKey } from "../../../../features/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../features/SMSVerification";
import onboardAdminUser from "../../../../__test-utils__/helpers/onboardAdminUser";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import { mockEmailNotificationsRepository, mockEmailVerificationRepository, MockServer, mockSMSVerificationRepository } from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("adminKYCApproveUser", () => {
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
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("updates user profile verification document & bank account upon approval", async () => {
    const address = "u1@ibexcm.com";
    const password = "password";

    await onboardAdminUser({ address, password }, db);

    const {
      data: {
        adminAuthenticate: { token },
      },
    } = await GraphQLClient.adminAuthenticate({ args: { address, password } });

    const pendingApprovalUser = await onboardUser();
    const [{ id: documentID }] = await db
      .user({ id: pendingApprovalUser.id })
      .profile()
      .documents()
      .guatemala()
      .dpi();
    const [{ id: bankAccountID }] = await db
      .user({ id: pendingApprovalUser.id })
      .bankAccounts();

    const governmentIDArgs = getGovernmentIDArgs(documentID);
    const bankAccountArgs = getBankAccountArgs(bankAccountID);

    const {
      data: { adminKYCApproveUser },
    } = await GraphQLClient.adminKYCApproveUser(
      { userArgs: { id: pendingApprovalUser.id }, governmentIDArgs, bankAccountArgs },
      token,
    );

    expect(adminKYCApproveUser).toBe(true);

    const [document] = await db
      .user({ id: pendingApprovalUser.id })
      .profile()
      .documents()
      .guatemala()
      .dpi();
    expect(document.verifiedAt).toBeDefined();
    expect(document.firstName).toEqual(governmentIDArgs.firstName);
    expect(document.lastName).toEqual(governmentIDArgs.lastName);
    expect(document.CUI).toEqual(governmentIDArgs.CUI);
    expect(document.expiresAt).toBeDefined();
    expect(document.genre).toEqual(governmentIDArgs.genre);
    expect(document.dateOfBirth).toBeDefined();

    const [bankAccount] = await db.user({ id: pendingApprovalUser.id }).bankAccounts();
    expect(bankAccount.verifiedAt).toBeDefined();
  });

  test("fails when user is not ADMIN", async () => {
    const {
      data: {
        verifyPhoneNumber: { token },
      },
    } = await GraphQLClient.verifyPhoneNumber({
      args: { number: Faker.phone.phoneNumber(), code: "12345" },
    });

    const governmentIDArgs = getGovernmentIDArgs("123");
    const bankAccountArgs = getBankAccountArgs("123");

    const { errors } = await GraphQLClient.adminKYCApproveUser(
      { userArgs: { id: "123" }, governmentIDArgs, bankAccountArgs },
      token,
    );

    expect(errors[0].extensions.code).toEqual(AuthenticationErrorCode.invalidAdminRole);
  });
});

const getGovernmentIDArgs = (id: string): AdminKycApproveUserGovernmentIdInput => ({
  firstName: "First Name",
  lastName: "Last Name",
  expiresAt: "2020-03-24",
  CUI: "123456789",
  genre: TGenre.Female,
  dateOfBirth: "1989-01-01",
  id,
});

const getBankAccountArgs = (id: string): AdminKycApproveUserBankAccountInput => ({
  id,
});
