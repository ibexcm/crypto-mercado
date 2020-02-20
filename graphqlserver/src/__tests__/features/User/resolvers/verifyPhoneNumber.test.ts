import { prisma as db } from "@ziina/database";
import { MutationVerifyPhoneNumberArgs } from "@ziina/libraries/api";
import { VerifyPhoneNumberMutation } from "@ziina/libraries/api/user";
import { TestDependencies } from "@ziina/libraries/di";
import { ApolloError } from "apollo-server-errors";
import { smsVerificationRepositoryInjectionKey } from "../../../../features/SMSVerification";
import { UserErrorCode } from "../../../../features/User/errors/UserError";
import { dbInjectionKey } from "../../../../InjectionKeys";
import {
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("verifyPhoneNumber", () => {
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

  test("creates contact with phone & returns SignupSession", async () => {
    const {
      data: {
        data: { verifyPhoneNumber },
      },
    } = await client.verifyPhoneNumber({ number, code });

    const contact = await db.phoneNumber({ number }).contact();
    const account = await db.contact({ id: contact.id }).account();
    const phoneNumber = await db.phoneNumber({ number });

    expect(verifyPhoneNumber.token).toBeDefined();
    expect(contact.id).toBeDefined();
    expect(account.id).toBeDefined();
    expect(phoneNumber.number).toEqual(number);
    expect(phoneNumber.verifiedAt).toBeDefined();
  });

  test("phone number taken", async () => {
    const {
      data: { errors },
    } = await client.verifyPhoneNumber({ number, code });

    expect(errors[0].extensions.code).toEqual(UserErrorCode.phoneNumberExists);
  });

  test("incorrect code", async () => {
    smsVerificationRepository.verifyCode = (number, code) => Promise.resolve(false);

    const newNumber = "+0000000000";
    const {
      data: { errors },
    } = await client.query<MutationVerifyPhoneNumberArgs, { errors?: ApolloError[] }>(
      VerifyPhoneNumberMutation,
      { number: newNumber, code },
    );

    expect(errors[0].extensions.code).toEqual(UserErrorCode.verificationCode);

    const phoneNumber = await db.phoneNumber({ number: newNumber });
    expect(phoneNumber).toBeNull();
  });
});
