import GraphQLClient from "../mocks/GraphQLClient";

export default async ({
  phoneNumber,
  address,
}: {
  phoneNumber?: string;
  address?: string;
}) => {
  const {
    data: { recoverAccount },
  } = await GraphQLClient.recoverAccount({
    args: { emailRecovery: { address }, smsRecovery: { number: phoneNumber } },
  });

  const token = recoverAccount.token;

  return { token };
};
