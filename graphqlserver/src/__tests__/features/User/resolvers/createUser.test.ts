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

const token = "thisIsAToken";
const expiresAt = new Date();

describe("createUser", () => {
  const number = "+971559691287";
  const code = "123456";
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
    const username = "username";
    const password = "password";

    const {
      data: {
        data: { verifyPhoneNumber },
      },
    } = await client.verifyPhoneNumber({ number, code });

    client.setAuthHeaders(verifyPhoneNumber.token);

    const {
      data: {
        data: { createUser },
      },
    } = await client.createUser({ username, password });

    expect(createUser.token).toBeDefined();
    expect(createUser.expiresAt).toBeDefined();

    const account = await db.account({ username });
    expect(account.username).toEqual(username);
    expect(account.password).not.toEqual(password);
  });

  test("username taken", async () => {
    const username = "username";
    const password = "password";

    const {
      data: {
        data: { verifyPhoneNumber },
      },
    } = await client.verifyPhoneNumber({ number: "+971559690000", code });

    client.setAuthHeaders(verifyPhoneNumber.token);

    const {
      data: { errors },
    } = await client.createUser({ username, password });

    expect(errors[0].extensions.code).toEqual(UserErrorCode.usernameTaken);
  });
});
