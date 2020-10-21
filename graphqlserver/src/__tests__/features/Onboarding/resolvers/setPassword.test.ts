import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../../../InjectionKeys";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import {
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("setPassword", () => {
  const code = "123456";
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

  test("creates account with clientID & returns Session", async () => {
    const address = "u3@ibexcm.com";
    const {
      data: {
        sendEmailVerificationCode: { token },
      },
    } = await GraphQLClient.sendEmailVerificationCode({
      args: { address },
    });

    const {
      data: { setPassword },
    } = await GraphQLClient.setPassword(
      { args: { password: "averystrongpassword" } },
      token,
    );

    const account = await db
      .email({ address })
      .contact()
      .user()
      .account();

    expect(setPassword.token).toBeDefined();
    expect(account.id).toBeDefined();
    expect(account.clientID).toBeDefined();
    expect(account.clientID).toHaveLength(8);
    expect(account.password).toBeDefined();
  });
});
