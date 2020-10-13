import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { OnboardingErrorCode } from "../../../../features/Onboarding/errors/OnboardingError";
import { dbInjectionKey } from "../../../../InjectionKeys";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import {
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("verifyPhoneNumber", () => {
  const number = "+50200000000";
  const code = "123456";
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
    await db.deleteManyUsers();
  });

  afterAll(() => {
    server.stop();
  });

  test("creates user with phone & returns Session", async () => {
    const {
      data: { verifyPhoneNumber },
    } = await GraphQLClient.verifyPhoneNumber({ args: { number, code } });

    const contact = await db.phoneNumber({ number }).contact();
    const user = await db.contact({ id: contact.id }).user();
    const role = await db
      .contact({ id: contact.id })
      .user()
      .role();
    const phoneNumber = await db.phoneNumber({ number });

    expect(verifyPhoneNumber.token).toBeDefined();
    expect(contact.id).toBeDefined();
    expect(user.id).toBeDefined();
    expect(role.type).toEqual("CUSTOMER");
    expect(phoneNumber.number).toEqual(number);
    expect(phoneNumber.verifiedAt).toBeDefined();
  });

  test("phone number taken", async () => {
    await expect(
      GraphQLClient.verifyPhoneNumber({ args: { number, code } }),
    ).rejects.toThrowError(OnboardingErrorCode.phoneNumberExists);
  });

  test("incorrect code", async () => {
    smsVerificationRepository.verifyCode = (number, code) => Promise.resolve(false);

    const newNumber = "+0000000000";
    await expect(
      GraphQLClient.verifyPhoneNumber({
        args: { number: newNumber, code },
      }),
    ).rejects.toThrowError(OnboardingErrorCode.verificationCode);

    const phoneNumber = await db.phoneNumber({ number: newNumber });
    expect(phoneNumber).toBeNull();
  });
});
