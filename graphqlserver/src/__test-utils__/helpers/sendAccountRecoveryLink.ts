import GraphQLClient from "../mocks/GraphQLClient";

export default async ({ address }: { address?: string }) => {
  const {
    data: { recoverAccount },
  } = await GraphQLClient.recoverAccount({
    args: { address },
  });

  return recoverAccount;
};
