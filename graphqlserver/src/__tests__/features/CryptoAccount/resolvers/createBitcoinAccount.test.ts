import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { config } from "../../../../config";
import { CryptoAccountErrorCode } from "../../../../features/CryptoAccount/errors/CryptoAccountError";
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

describe("createBitcoinAccount", () => {
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
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("success", async () => {
    const { user: newUser, address, password } = await onboardUser();

    await adminKYCApproveUser(newUser, db, { address: adminAccountEmailAddress });

    const { token } = await authenticate({ address, password });

    const bitcoinAddress = await generateBitcoinAddress();

    const {
      data: { createBitcoinAccount },
    } = await GraphQLClient.createBitcoinAccount(
      { args: { address: bitcoinAddress } },
      token,
    );

    expect(createBitcoinAccount).toBe(true);
  });

  test("address exists", async () => {
    const { user: newUser, address, password } = await onboardUser();

    await adminKYCApproveUser(newUser, db, { address: adminAccountEmailAddress });

    const { token } = await authenticate({ address, password });

    const bitcoinAddress = await generateBitcoinAddress();

    await GraphQLClient.createBitcoinAccount({ args: { address: bitcoinAddress } }, token);

    await expect(
      GraphQLClient.createBitcoinAccount({ args: { address: bitcoinAddress } }, token),
    ).rejects.toThrowError(CryptoAccountErrorCode.bitcoinAddressAlreadyExists);
  });

  test("invalid address", async () => {
    const { user: newUser, address, password } = await onboardUser();

    await adminKYCApproveUser(newUser, db, { address: adminAccountEmailAddress });

    const { token } = await authenticate({ address, password });

    let bitcoinAddress = "";

    await expect(
      GraphQLClient.createBitcoinAccount({ args: { address: bitcoinAddress } }, token),
    ).rejects.toThrowError(CryptoAccountErrorCode.invalidBitcoinAddress);

    bitcoinAddress = "invalid";

    await expect(
      GraphQLClient.createBitcoinAccount({ args: { address: bitcoinAddress } }, token),
    ).rejects.toThrowError(CryptoAccountErrorCode.invalidBitcoinAddress);
  });
});
