import { prisma as db } from "@ziina/database";
import { TestDependencies } from "@ziina/libraries/di";
import { sessionRepositoryInjectionKey } from "../../../../features/Session";
import { UserErrorCode } from "../../../../features/User/errors/UserError";
import { dbInjectionKey } from "../../../../InjectionKeys";
import { MockServer } from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";
import { mockSessionRepository } from "../../../../__test-utils__/mocks/Session";
import { newUser } from "../../../../__test-utils__/mocks/User";

const token = "thisIsAToken";
const expiresAt = new Date();

describe("authenticate", () => {
  const number = "+971559691287";
  const client = new GraphQLClient();
  const dependencies = new TestDependencies();
  dependencies.override(dbInjectionKey, _ => db);
  dependencies.override(sessionRepositoryInjectionKey, _ =>
    mockSessionRepository(token, expiresAt),
  );

  const server = new MockServer(dependencies);

  beforeAll(async () => {
    await server.start();
  });

  beforeEach(async () => {
    await db.deleteManyAccounts();
    await db.deleteManyContacts();
  });

  afterAll(() => {
    server.stop();
  });

  test("success", async () => {
    const username = "username";
    const password = "password";

    await newUser(db, username, password, number);

    const {
      data: {
        data: { authenticate },
      },
    } = await client.authenticate({ username, password });

    expect(authenticate.token).toEqual(token);
    expect(new Date(authenticate.expiresAt)).toEqual(expiresAt);
  });

  test("username does not exist", async () => {
    const username = "username";
    const password = "password";

    await newUser(db, username, password, number);

    const {
      data: { errors },
    } = await client.authenticate({ username: "differentusername", password });

    expect(errors[0].extensions.code).toEqual(UserErrorCode.invalidUsername);
  });

  test("incorrect password", async () => {
    const username = "username";
    const password = "password";

    await newUser(db, username, password, number);

    const {
      data: { errors },
    } = await client.authenticate({ username, password: "differentpassword" });

    expect(errors[0].extensions.code).toEqual(UserErrorCode.invalidCredential);
  });
});
