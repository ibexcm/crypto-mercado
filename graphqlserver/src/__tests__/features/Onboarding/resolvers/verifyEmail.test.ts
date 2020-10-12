import { prisma as db } from "@ibexcm/database";
import { TestDependencies } from "@ibexcm/libraries/di";
import { OnboardingErrorCode } from "../../../../features/Onboarding/errors/OnboardingError";
import { dbInjectionKey } from "../../../../InjectionKeys";
import { emailVerificationRepositoryInjectionKey } from "../../../../libraries/EmailVerification";
import { smsVerificationRepositoryInjectionKey } from "../../../../libraries/SMSVerification";
import {
  mockEmailVerificationRepository,
  MockServer,
  mockSMSVerificationRepository,
} from "../../../../__test-utils__/mocks";
import GraphQLClient from "../../../../__test-utils__/mocks/GraphQLClient";

describe("verifyEmail", () => {
  const address = "email1@ibexcm.com";
  const code = "123456";
  const dependencies = new TestDependencies();
  const emailVerificationRepository = mockEmailVerificationRepository();
  dependencies.override(dbInjectionKey, _ => db);
  dependencies.override(
    emailVerificationRepositoryInjectionKey,
    _ => emailVerificationRepository,
  );
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

  test("creates contact.email in user & returns Session", async () => {
    const {
      data: {
        verifyPhoneNumber: { token },
      },
    } = await GraphQLClient.verifyPhoneNumber({ args: { number: "+0000000001", code } });

    const {
      data: { verifyEmail },
    } = await GraphQLClient.verifyEmail({ args: { address, code } }, token);

    const contact = await db.email({ address }).contact();
    const user = await db.contact({ id: contact.id }).user();
    const email = await db.email({ address });

    expect(verifyEmail.token).toBeDefined();
    expect(contact.id).toBeDefined();
    expect(user.id).toBeDefined();
    expect(email.address).toEqual(address);
    expect(email.verifiedAt).toBeDefined();
  });

  test("email address taken", async () => {
    const {
      data: {
        verifyPhoneNumber: { token },
      },
    } = await GraphQLClient.verifyPhoneNumber({ args: { number: "+0000000002", code } });

    await expect(
      GraphQLClient.verifyEmail({ args: { address, code } }, token),
    ).rejects.toThrowError(OnboardingErrorCode.emailExists);
  });

  test("incorrect code", async () => {
    const {
      data: {
        verifyPhoneNumber: { token },
      },
    } = await GraphQLClient.verifyPhoneNumber({ args: { number: "+0000000003", code } });

    emailVerificationRepository.verifyCode = (email, code) => Promise.resolve(false);

    const newAddress = "email2@ibexcm.com";
    await expect(
      GraphQLClient.verifyEmail(
        {
          args: { address: newAddress, code },
        },
        token,
      ),
    ).rejects.toThrowError(OnboardingErrorCode.verificationCode);

    const email = await db.email({ address: newAddress });
    expect(email).toBeNull();
  });
});
