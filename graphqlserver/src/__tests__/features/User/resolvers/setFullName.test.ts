import { prisma as db } from "@ziina/database";
import { TestDependencies } from "@ziina/libraries/di";
import { smsVerificationRepositoryInjectionKey } from "../../../../features/SMSVerification";
import { UserErrorCode } from "../../../../features/User/errors/UserError";
import { dbInjectionKey } from "../../../../InjectionKeys";
import {
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("setFullName", () => {
  const number = "+971559691287";
  const code = "123456";
  const fullName = "Full Name";
  const client = new GraphQLClient();
  const dependencies = new TestDependencies();
  const smsVerificationRepository = mockSMSVerificationRepository();
  dependencies.override(dbInjectionKey, _ => db);
  dependencies.override(
    smsVerificationRepositoryInjectionKey,
    _ => smsVerificationRepository,
  );

  const server = new MockServer(dependencies);

  beforeAll(async () => {
    await server.start();
    await db.deleteManyAccounts();
    await db.deleteManyContacts();
  });

  afterAll(() => {
    server.stop();
  });

  test("success", async () => {
    const {
      data: {
        data: { verifyPhoneNumber },
      },
    } = await client.verifyPhoneNumber({ number, code });

    client.setAuthHeaders(verifyPhoneNumber.token);

    const {
      data: {
        data: { setFullName },
      },
    } = await client.setFullName({ fullName });

    const account = await db
      .phoneNumber({ number })
      .contact()
      .account();

    expect(setFullName).toEqual(true);
    expect(account.fullName).toEqual(fullName);
  });

  test("wrong Account error", async () => {
    client.setAuthHeaders(null);

    const {
      data: { errors },
    } = await client.setFullName({ fullName });

    expect(errors[0].extensions.code).toEqual(UserErrorCode.invalidCredential);
  });
});
