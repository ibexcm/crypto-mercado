import isValidEmail from "../isValidEmail";

describe("Email Validation", () => {
  test("Should validate a correct email and return true", () => {
    const support = "user@ibexcm.org";
    const admin = "admin@ibexcm.org";
    const client = "client@gmail.com";

    expect(isValidEmail(support)).toBe(true);
    expect(isValidEmail(admin)).toBe(true);
    expect(isValidEmail(client)).toBe(true);
  });

  test("Should validate a wrong email and return false", () => {
    const wrongEmail = "wrong";
    const spam = "zxcvbsee@.com";

    expect(isValidEmail(wrongEmail)).toBe(false);
    expect(isValidEmail(spam)).toBe(false);
  });
});
