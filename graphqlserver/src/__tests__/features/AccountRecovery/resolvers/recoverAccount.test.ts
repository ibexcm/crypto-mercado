import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import {
  mockEmailAccountRecoveryRepository,
  mockSMSAccountRecoveryRepository,
  MockServer,
} from "../../../../__test-utils__/mocks";

import { emailAccountRecoveryRepositoryInjectionKey } from "../../../../libraries/EmailVerification";
import { smsAccountRecoveryRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import onboardUser from "../../../../__test-utils__/helpers/onboardUser";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("Get Account Recovery Link", () => {
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
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("Should Send a email and return a Session", async () => {
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

    expect(recoverAccount.token).toBeDefined();
  });

  test("Should send a sms and return a Session", async () => {
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

    expect(recoverAccount.token).toBeDefined();
  });
});
