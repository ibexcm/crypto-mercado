import { PhoneNumberUtil } from "google-libphonenumber";
import { CountryPhoneNumberCode } from "../models/country";

export default function isValidPhoneNumber(phoneNumber: string): boolean {
  const Verificator = new PhoneNumberUtil();

  if (
    !Boolean(phoneNumber.length >= 8) ||
    [CountryPhoneNumberCode.GTQ].includes(phoneNumber as CountryPhoneNumberCode)
  ) {
    return false;
  }

  const parsedNumber = Verificator.parse(phoneNumber, "GT");

  return Verificator.isValidNumberForRegion(parsedNumber, "GT");
}
