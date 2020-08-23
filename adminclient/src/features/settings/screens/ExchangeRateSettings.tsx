import { MutationAdminSettingsCreateExchangeRateArgs } from "@ibexcm/libraries/api";
import {
  Box,
  Container,
  Grid,
  InputAdornment,
  Paper,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { RouteComponentProps } from "react-router";
import {
  Button,
  Sidebar,
  TextField,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { UserRepositoryInjectionKeys } from "../../user/InjectionKeys";
import { ExchangeRateSettingsInjectionKeys } from "../InjectionKeys";

interface Props extends WithStyles, RouteComponentProps<{ id: string }> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const ExchangeRateSettings = dependencies.provide(ExchangeRateSettingsInjectionKeys);
  const UserRepository = dependencies.provide(UserRepositoryInjectionKeys);

  const [error, setError] = React.useState<Error | null>(null);
  const [input, setInput] = React.useState<MutationAdminSettingsCreateExchangeRateArgs>({
    args: {
      price: "0.00",
    },
  });

  const { data: userQueryData } = UserRepository.useUserQuery();

  const {
    executeAdminSettingsCreateExchangeRateMutation,
    state: {
      data: adminSettingsCreateExchangeRateData,
      loading: isAdminSettingsCreateExchangeRateLoading,
    },
  } = ExchangeRateSettings.useAdminSettingsCreateExchangeRate();

  const [{ currency }] = userQueryData?.user?.bankAccounts ?? [
    { currency: { symbol: "..." } },
  ];

  const onChangeInputArgsPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const price = event.target.value;
    setInput({ args: { price } });
  };

  const onClickAdminSettingsCreateExchangeRate = async () => {
    try {
      await executeAdminSettingsCreateExchangeRateMutation(input);
    } catch (error) {}
  };

  return (
    <Box className={classes.drawerContainer}>
      <Sidebar history={history}></Sidebar>
      <Container maxWidth={false} className={classes.mainContainer}>
        <ToolbarPadding />
        <Box mb={5}>
          <Grid container spacing={2}>
            <Grid item lg={6}>
              <Typography variant="h5">Ajustes: Tipo de Cambio</Typography>
            </Grid>
          </Grid>
        </Box>
        <Grid container justify="space-between">
          <Grid item xs={12} lg={5}>
            <Box mb={3}>
              <Paper>
                <TextField
                  fullWidth
                  label="Precio por Dólar"
                  variant="outlined"
                  disabled={isAdminSettingsCreateExchangeRateLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">{currency.symbol}</InputAdornment>
                    ),
                  }}
                  value={input.args.price}
                  onChange={onChangeInputArgsPrice}
                  type="number"
                />
              </Paper>
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={onClickAdminSettingsCreateExchangeRate}
                >
                  {isAdminSettingsCreateExchangeRateLoading ? "Guardando" : "Guardar"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export const ExchangeRateSettings = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
