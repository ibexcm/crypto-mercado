import { Bank, Currency, Query } from "@ibexcm/libraries/api";
import {
  Backdrop,
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import { RouteComponentProps } from "react-router";
import {
  Button,
  InputErrorBox,
  StepsSidebar,
  TextField,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { UserRepositoryInjectionKeys } from "../../../features/user/InjectionKeys";
import { MutationSetBankAccountArgs, TGuatemalaBankAccount } from "../../../libraries/api";
import routes from "../../../routes";
import { MobileAppBar } from "../components";
import { OnboardingRepositoryInjectionKeys } from "../InjectionKeys";

interface Props extends WithStyles, RouteComponentProps {}

const Component: React.FC<Props> = ({ classes, history, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const OnboardingRepository = dependencies.provide(OnboardingRepositoryInjectionKeys);
  const UserRepository = dependencies.provide(UserRepositoryInjectionKeys);
  const [error, setError] = React.useState<Error | null>(null);
  const [input, setInput] = React.useState<MutationSetBankAccountArgs>({
    args: {
      accountNumber: "",
      bankAccountType: "",
      bankID: "",
      currencyID: "",
      fullName: "",
    },
  });

  const {
    data: userQueryData,
    loading: isLoadingUserQuery,
    error: userQueryError,
  } = UserRepository.useUserQuery();

  const {
    execute: executeSetPasswordMutation,
  } = OnboardingRepository.useSetBankAccountMutation();

  const [
    executeGetBanksByCountry,
    {
      data: getBanksByCountryData,
      loading: isLoadingGetBanksByCountry,
      error: getBanksByCountryError,
    },
  ] = OnboardingRepository.useGetBanksByCountryQuery();

  const [
    executeGetCurrenciesByCountry,
    {
      data: getCurrenciesByCountryData,
      loading: isLoadingGetCurrenciesByCountry,
      error: getCurrenciesByCountryError,
    },
  ] = OnboardingRepository.useGetCurrenciesByCountryQuery();

  React.useEffect(() => {
    if (Boolean(userQueryData?.user)) {
      (async () => {
        try {
          const {
            user: {
              profile: {
                country: { id: countryID },
              },
            },
          } = userQueryData;
          await executeGetBanksByCountry({ args: { countryID } });
          await executeGetCurrenciesByCountry({ args: { countryID } });
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [isLoadingUserQuery]);

  if (
    isLoadingUserQuery ||
    isLoadingGetBanksByCountry ||
    isLoadingGetCurrenciesByCountry ||
    !Boolean(getBanksByCountryData?.getBanksByCountry) ||
    !Boolean(getCurrenciesByCountryData?.getCurrenciesByCountry)
  ) {
    return (
      <Backdrop className={classes.backdrop} open={isLoadingUserQuery}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const onSetBankAccount = async () => {
    try {
      await executeSetPasswordMutation(input);
      history.push(routes.onboarding.done);
    } catch (error) {
      setError(error);
    }
  };

  const onSetAccountNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const accountNumber = event.target.value;
    setInput({ args: { ...input.args, accountNumber } });
  };

  const onSetFullName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = event.target.value;
    setInput({ args: { ...input.args, fullName } });
  };

  const onSetBankID = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const bankID = event.target.value as string;
    setInput({ args: { ...input.args, bankID } });
  };

  const onSetCurrencyID = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const currencyID = event.target.value as string;
    setInput({ args: { ...input.args, currencyID } });
  };

  const onSetBankAccountType = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const bankAccountType = event.target.value as TGuatemalaBankAccount;
    setInput({ args: { ...input.args, bankAccountType } });
  };

  const { getBanksByCountry: banks } = getBanksByCountryData as Pick<
    Query,
    "getBanksByCountry"
  >;

  const { getCurrenciesByCountry: currencies } = getCurrenciesByCountryData as Pick<
    Query,
    "getCurrenciesByCountry"
  >;

  return (
    <Box className={classes.drawerContainer}>
      <StepsSidebar />
      <Container maxWidth="xs">
        <MobileAppBar />
        <ToolbarPadding />
        <Box mb={4}>
          <Typography variant="h5" mb={1}>
            ¿A qué cuenta
            <br /> depositamos tu dinero?
          </Typography>
          <Typography gutterBottom>
            Ingresa la cuenta bancaria a donde quieres que depositemos los fondos.
          </Typography>
          <Typography>
            El destinatario debe coincidir con el nombre del DPI que subiste en el paso
            anterior.
          </Typography>
        </Box>
        <Box mb={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Selecciona un banco</InputLabel>
            <Select value={input.args.bankID} onChange={onSetBankID} fullWidth>
              {banks.map((bank: Bank, index) => (
                <MenuItem key={index} value={bank.id}>
                  {bank.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={6} lg={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo de cuenta</InputLabel>
                <Select
                  value={input.args.bankAccountType}
                  onChange={onSetBankAccountType}
                  fullWidth
                >
                  <MenuItem value={TGuatemalaBankAccount.Monetaria}>
                    {TGuatemalaBankAccount.Monetaria}
                  </MenuItem>
                  <MenuItem value={TGuatemalaBankAccount.Ahorro}>
                    {TGuatemalaBankAccount.Ahorro}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} lg={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Divisa</InputLabel>
                <Select value={input.args.currencyID} onChange={onSetCurrencyID} fullWidth>
                  {currencies.map((currency: Currency, index) => (
                    <MenuItem key={index} value={currency.id}>
                      {currency.symbol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box mb={3}>
          <TextField
            fullWidth
            label="Número de cuenta"
            placeholder="eg. 01-234567-89"
            variant="outlined"
            onChange={onSetAccountNumber}
            value={input.args.accountNumber}
            type="number"
          />
        </Box>
        <Box mb={3}>
          <TextField
            fullWidth
            label="Nombre completo"
            variant="outlined"
            onChange={onSetFullName}
            value={input.args.fullName}
          />
        </Box>
        <Box mb={4}>
          <InputErrorBox error={error} />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            size="large"
            onClick={onSetBankAccount}
          >
            Continuar
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export const SetBankAccount = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
