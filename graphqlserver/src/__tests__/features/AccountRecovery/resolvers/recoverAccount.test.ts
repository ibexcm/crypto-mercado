import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { AccountRecoveryErrorCode } from "../../../../features/AccountRecovery/errors/AccountRecoveryError";
import { emailAccountRecoveryRepositoryInjectionKey } from "../../../../libraries/EmailVerification";
import { smsAccountRecoveryRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import {
  mockEmailAccountRecoveryRepository,
  MockServer,
  mockSMSAccountRecoveryRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("recoverAccount", () => {
  const dependencies = new TestDependencies();

  dependencies.override(smsAccountRecoveryRepositoryInjectionKey, _ =>
    mockSMSAccountRecoveryRepository(),
  );
  dependencies.override(emailAccountRecoveryRepositoryInjectionKey, _ =>
    mockEmailAccountRecoveryRepository(),
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

  test("Should Send an email and return a Session", async () => {
    const recoveryEmailAddress = "user@ibexcm.com";

    await onboardUser({
      address: recoveryEmailAddress,
    });

    const {
      data: { recoverAccount },
    } = await GraphQLClient.recoverAccount({
      args: {
        emailRecovery: { address: recoveryEmailAddress },
      },
    });

    expect(recoverAccount).toBeDefined();
    expect(recoverAccount).toBe(true);
  });

  test("Should send an sms and return a Session", async () => {
    const address = "usr1@ibexcm.org";
    const password = "password";
    const phoneNumber = "+000000000";

    await onboardUser({
      address,
      password,
      number: phoneNumber,
    });

    const {
      data: { recoverAccount },
    } = await GraphQLClient.recoverAccount({
      args: {
        smsRecovery: { number: phoneNumber },
      },
    });

    expect(recoverAccount).toBeDefined();
    expect(recoverAccount).toBe(true);
  });

  test("unexistent email and number", async () => {
    const address = "usr1@ibexcm.org";
    const number = "+00000000001";

    await expect(
      GraphQLClient.recoverAccount({
        args: {
          emailRecovery: { address },
          smsRecovery: { number },
        },
      }),
    ).rejects.toThrowError(AccountRecoveryErrorCode.unregisteredUser);
  });

  test("existent email and existent number", async () => {
    const address = "u1@ibexcm.com";
    const number = "+00000000001";

    await onboardUser({
      address,
      number,
    });

    const {
      data: { recoverAccount },
    } = await GraphQLClient.recoverAccount({
      args: {
        emailRecovery: { address },
        smsRecovery: { number: "+00000000002" },
      },
    });

    expect(recoverAccount).toBeDefined();
    expect(recoverAccount).toBe(true);
  });
});
