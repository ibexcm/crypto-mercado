import { ApolloError } from "apollo-server-errors";

export enum CryptoAccountErrorCode {
  bitcoinAddressAlreadyExists = "bitcoinAddressAlreadyExists",
  invalidBitcoinAddress = "invalidBitcoinAddress",
}

const bitcoinAddressAlreadyExistsError = new ApolloError(
  "The bitcoin address is already taken",
  CryptoAccountErrorCode.bitcoinAddressAlreadyExists,
);

const invalidBitcoinAddressExistsError = new ApolloError(
  "Invalid bitcoin address",
  CryptoAccountErrorCode.invalidBitcoinAddress,
);

export const CryptoAccountError = {
  bitcoinAddressAlreadyExistsError,
  invalidBitcoinAddressExistsError,
};
