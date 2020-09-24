import isValidPassword from "../isValidPassword";

describe("Password Validation", () => {
  test("Should evaluate a weak password and return false ", () => {
    const weakPasswordOne = "1234";
    const weakPasswordTwo = "root";
    const weakCamouflaged = "AAaaAAaa";

    expect(isValidPassword(weakPasswordOne)).toBe(false);
    expect(isValidPassword(weakPasswordTwo)).toBe(false);
    expect(isValidPassword(weakCamouflaged)).toBe(false);
  });

  test("Should evaluate a password of medium strength and return true", () => {
    const mediumStrength = "EguEuwxO!";

    expect(isValidPassword(mediumStrength)).toBe(true);
  });

  test("Should evaluate a strong password and return true", () => {
    const strongPassword = "kzsT3gTByJJnBq";

    expect(isValidPassword(strongPassword)).toBe(true);
  });

  test("Should evaluate a maximum security password and return true", () => {
    const maximunSecurityPassword = "2(B-,+qD?%sukqZPxU:x!d~t";

    expect(isValidPassword(maximunSecurityPassword)).toBe(true);
  });
});
