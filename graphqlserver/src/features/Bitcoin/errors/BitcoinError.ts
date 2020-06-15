import { ApolloError } from "apollo-server-errors";

export enum BitcoinErrorCode {
  emptyHistoricalPrices = "emptyHistoricalPrices",
}

const emptyHistoricalPrices = new ApolloError(
  "Historical prices couldn't be fetched or came empty",
  BitcoinErrorCode.emptyHistoricalPrices,
);

export const BitcoinError = {
  emptyHistoricalPrices,
};
