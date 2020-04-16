import { InjectionKey, InjectionKeyScope } from "@ibexcm/libraries/di";
import { dbInjectionKey } from "../../InjectionKeys";
import { emailNotificationsRepositoryInjectionKey } from "../../libraries/EmailVerification";
import { BitcoinRepositoryInjectionKey } from "../Bitcoin/InjectionKeys";
import { ExchangeRateRepositoryInjectionKey } from "../ExchangeRate/InjectionKeys";
import { TransactionFeeRepositoryInjectionKey } from "../TransactionFee/InjectionKeys";
import { TransactionRepository } from "./repositories/TransactionRepository";
import { TransactionTaxRepository } from "./repositories/TransactionTaxRepository";

export const TransactionRepositoryInjectionKey: InjectionKey<TransactionRepository> = {
  name: "TransactionRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    const db = dependencies.provide(dbInjectionKey);
    const emailNotificationsRepository = dependencies.provide(
      emailNotificationsRepositoryInjectionKey,
    );
    const BitcoinRepository = dependencies.provide(BitcoinRepositoryInjectionKey);
    const TransactionFeeRepository = dependencies.provide(
      TransactionFeeRepositoryInjectionKey,
    );
    const TransactionTaxRepository = dependencies.provide(
      TransactionTaxRepositoryInjectionKey,
    );
    const ExchangeRateRepository = dependencies.provide(ExchangeRateRepositoryInjectionKey);

    return new TransactionRepository(
      db,
      emailNotificationsRepository,
      BitcoinRepository,
      TransactionFeeRepository,
      TransactionTaxRepository,
      ExchangeRateRepository,
    );
  },
};

export const TransactionTaxRepositoryInjectionKey: InjectionKey<TransactionTaxRepository> = {
  name: "TransactionTaxRepository",
  scope: InjectionKeyScope.singleton,
  closure: dependencies => {
    return new TransactionTaxRepository();
  },
};
