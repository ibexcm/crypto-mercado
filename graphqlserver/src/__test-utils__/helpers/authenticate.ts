import GraphQLClient from "../mocks/GraphQLClient";

export default async ({
  address,
  password,
}: {
  address?: string;
  password?: string;
} = {}) => {
  const {
    data: {
      authenticate: { token },
    },
  } = await GraphQLClient.authenticate({ args: { address, password } });

  return { token };
};
