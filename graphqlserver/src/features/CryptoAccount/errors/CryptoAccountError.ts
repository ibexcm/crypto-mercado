import { ApolloError } from "apollo-server-errors";

export enum CryptoAccountErrorCode {
  bitcoinAddressAlreadyExists = "bitcoinAddressAlreadyExists",
}

const bitcoinAddressAlreadyExistsError = new ApolloError(
  "The bitcoin address is already taken",
  CryptoAccountErrorCode.bitcoinAddressAlreadyExists,
);

export const CryptoAccountError = {
  bitcoinAddressAlreadyExistsError,
};
