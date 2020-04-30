import { TGuatemalaBankAccount } from "@ibexcm/libraries/api";
import Faker from "faker";
import GraphQLClient from "../mocks/GraphQLClient";

export default async ({
  number,
  address,
  password,
}: {
  number?: string;
  address?: string;
  password?: string;
} = {}) => {
  const code = "123456";
  const fullName = "Full Bank Account Name Pérez";
  const accountNumber = "01-234567-89";
  const bankAccountType = TGuatemalaBankAccount.Monetaria;

  address = address ?? Faker.internet.email();
  number = number ?? Faker.phone.phoneNumber();
  password = password ?? "password";

  const {
    data: {
      verifyPhoneNumber: { token },
    },
  } = await GraphQLClient.verifyPhoneNumber({
    args: { number, code },
  });

  await GraphQLClient.verifyEmail({ args: { address, code } }, token);

  await GraphQLClient.setPassword({ args: { password } }, token);

  await GraphQLClient.uploadGovernmentID({ args: { fileHash: "hash123" } }, token);

  const {
    data: {
      user: {
        profile: {
          country: { id: countryID },
        },
      },
    },
  } = await GraphQLClient.user(token);

  const {
    data: { getBanksByCountry },
  } = await GraphQLClient.getBanksByCountry({ args: { countryID } });

  const {
    data: { getCurrenciesByCountry },
  } = await GraphQLClient.getCurrenciesByCountry({ args: { countryID } });

  const [{ id: bankID }] = getBanksByCountry;
  const [{ id: currencyID }] = getCurrenciesByCountry;

  await GraphQLClient.setBankAccount(
    { args: { fullName, accountNumber, bankID, currencyID, bankAccountType } },
    token,
  );

  const {
    data: { user },
  } = await GraphQLClient.user(token);

  return { user, token, address, password };
};
