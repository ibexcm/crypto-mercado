import { TGuatemalaBankAccount } from "@ibexcm/libraries/api";
import { CurrencySymbol } from "@ibexcm/libraries/models/currency";
import GraphQLClient from "../mocks/GraphQLClient";

export default async (adminToken: string) => {
  const {
    data: {
      user: {
        profile: {
          country: { id: countryID },
        },
      },
    },
  } = await GraphQLClient.user(adminToken);

  const {
    data: { getBanksByCountry },
  } = await GraphQLClient.getBanksByCountry({ args: { countryID } });

  const {
    data: { getCurrenciesByCountry },
  } = await GraphQLClient.getCurrenciesByCountry({ args: { countryID } });

  const [, { id: bankID }] = getBanksByCountry;
  const [{ id: currencyID }] = getCurrenciesByCountry.filter(
    currency => currency.symbol === CurrencySymbol.GTQ,
  );

  await GraphQLClient.setBankAccount(
    {
      args: {
        fullName: "Admin Full Name",
        accountNumber: "012345612",
        bankID,
        currencyID,
        bankAccountType: TGuatemalaBankAccount.Monetaria,
      },
    },
    adminToken,
  );
};
