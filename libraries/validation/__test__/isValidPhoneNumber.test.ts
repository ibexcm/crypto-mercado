import isValidPhoneNumber from "../isValidPhoneNumber";

describe("Phone Number Validation", () => {
  test("Should validate a wrong phone number and return false", () => {
    const invalidNumber = "+50233";
    const noAreaCode = "334455";
    const nonExists = "+50200000000";
    const otherNonExistent = "+50211001100";

    expect(isValidPhoneNumber(invalidNumber)).toBe(false);
    expect(isValidPhoneNumber(noAreaCode)).toBe(false);
    expect(isValidPhoneNumber(nonExists)).toBe(false);
    expect(isValidPhoneNumber(otherNonExistent)).toBe(false);
  });

  test("Should validate a correct phone number and return true", () => {
    const number = "+50233467131";
    const noAreaCode = "45035590";

    expect(isValidPhoneNumber(number)).toBe(true);
    expect(isValidPhoneNumber(noAreaCode)).toBe(true);
  });
});
