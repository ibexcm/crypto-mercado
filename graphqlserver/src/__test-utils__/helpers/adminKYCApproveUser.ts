import { Prisma, User } from "@ibexcm/database";
import {
  AdminKycApproveUserBankAccountInput,
  AdminKycApproveUserGovernmentIdInput,
  TGenre,
} from "@ibexcm/libraries/api";
import Faker from "faker";
import GraphQLClient from "../mocks/GraphQLClient";
import onboardAdminUser from "./onboardAdminUser";

export const getGovernmentIDArgs = (id: string): AdminKycApproveUserGovernmentIdInput => ({
  firstName: "First Name",
  lastName: "Last Name",
  expiresAt: "2020-03-24",
  CUI: "123456789",
  genre: TGenre.Female,
  dateOfBirth: "1989-01-01",
  id,
});

export const getBankAccountArgs = (id: string): AdminKycApproveUserBankAccountInput => ({
  id,
});

export default async (user: User, db: Prisma) => {
  const [{ id: documentID }] = await db
    .user({ id: user.id })
    .profile()
    .documents()
    .guatemala()
    .dpi();
  const [{ id: bankAccountID }] = await db.user({ id: user.id }).bankAccounts();

  const governmentIDArgs = getGovernmentIDArgs(documentID);
  const bankAccountArgs = getBankAccountArgs(bankAccountID);

  const address = Faker.internet.email();
  const password = "password";

  await onboardAdminUser({ address, password }, db);

  const {
    data: {
      adminAuthenticate: { token },
    },
  } = await GraphQLClient.adminAuthenticate({ args: { address, password } });

  const {
    data: { adminKYCApproveUser },
  } = await GraphQLClient.adminKYCApproveUser(
    { userArgs: { id: user.id }, governmentIDArgs, bankAccountArgs },
    token,
  );

  return adminKYCApproveUser;
};
