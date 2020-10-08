import { PhoneNumberUtil } from "google-libphonenumber";

export default function isValidPhoneNumber(phoneNumber: string): boolean {
  const Verificator = new PhoneNumberUtil();
  const phoneNumberCodeGT = "+502";

  if (!Boolean(phoneNumber.length >= 8)) {
    return false;
  } else if (Boolean(phoneNumber === phoneNumberCodeGT)) {
    return false;
  }

  const parsedNumber = Verificator.parse(phoneNumber, "GT");

  return Verificator.isValidNumberForRegion(parsedNumber, "GT");
}
