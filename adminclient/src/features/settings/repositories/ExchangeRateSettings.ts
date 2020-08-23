import { MutationResult, useMutation } from "@apollo/client";
import {
  ExchangeRate,
  Mutation,
  MutationAdminSettingsCreateExchangeRateArgs,
} from "@ibexcm/libraries/api";
import { AdminSettingsCreateExchangeRateMutation } from "@ibexcm/libraries/api/exchangeRate";

export class ExchangeRateSettings {
  useAdminSettingsCreateExchangeRate(): {
    executeAdminSettingsCreateExchangeRateMutation: (
      args: MutationAdminSettingsCreateExchangeRateArgs,
    ) => void;
    state: MutationResult<ExchangeRate>;
  } {
    const [execute, state] = useMutation(AdminSettingsCreateExchangeRateMutation);

    const executeAdminSettingsCreateExchangeRateMutation = async (variables) => {
      const message = "Falló la creación del tipo de cambio.";
      try {
        const {
          data,
          error,
        }: Partial<MutationResult<
          Pick<Mutation, "adminSettingsCreateExchangeRate">
        >> = await execute({
          variables,
        });

        if (Boolean(error) || !Boolean(data?.adminSettingsCreateExchangeRate)) {
          throw new Error(message);
        }
      } catch (error) {
        throw new Error(message);
      }
    };

    return {
      state,
      executeAdminSettingsCreateExchangeRateMutation,
    };
  }
}
