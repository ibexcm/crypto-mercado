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
import { newContact, newUser } from "../../../../__test-utils__/mocks/User";

describe("sendVerificationCode", () => {
  const number = "+971559691287";
  const client = new GraphQLClient();
  const dependencies = new TestDependencies();
  dependencies.override(dbInjectionKey, _ => db);
  dependencies.override(smsVerificationRepositoryInjectionKey, _ =>
    mockSMSVerificationRepository(),
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
        data: { sendVerificationCode },
      },
    } = await client.sendVerificationCode({ number });

    expect(sendVerificationCode).toBe(true);
  });

  test("contact created but not assigned", async () => {
    newContact(db, number);

    const {
      data: {
        data: { sendVerificationCode },
      },
    } = await client.sendVerificationCode({ number });

    expect(sendVerificationCode).toBe(true);
  });

  test("phone number taken", async () => {
    await newUser(db, "username", "password", number);

    const {
      data: { errors },
    } = await client.sendVerificationCode({ number });

    expect(errors[0].extensions.code).toEqual(UserErrorCode.phoneNumberExists);
  });
});
