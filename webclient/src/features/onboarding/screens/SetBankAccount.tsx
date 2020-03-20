import { MutationSetBankAccountArgs, TGuatemalaBankAccount } from "@ibexcm/libraries/api";
import {
  Backdrop,
  Box,
  Container,
  FormControl,
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
      fullName: "",
    },
  });

  const {
    data: userQueryData,
    loading: isLoadingUserQuery,
    error: userQueryError,
  } = UserRepository.useUserQuery();

  if (isLoadingUserQuery) {
    return (
      <Backdrop className={classes.backdrop} open={isLoadingUserQuery}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

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

  const onSetBankAccount = async () => {
    try {
      await executeSetPasswordMutation(input);
      history.push(routes.onboarding.uploadGovernmentID);
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

  const onSetBankAccountType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const bankAccountType = event.target.value;
    setInput({ args: { ...input.args, bankAccountType } });
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSetBankAccount();
    }
  };

  return (
    <Box display="flex">
      <StepsSidebar />
      <Container maxWidth="xl">
        <MobileAppBar />
        <ToolbarPadding />
        <Box mb={4}>
          <Typography variant="h5" mb={1}>
            Elige una contraseña
          </Typography>
          <Typography>
            Aunque no guardamos tus llaves privadas, es importante que tu contraseña sea
            segura.
          </Typography>
        </Box>
        <Box mb={4}>
          <FormControl variant="filled">
            <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
            <Select value={input.args.bankAccountType} onChange={onSetBankID}>
              <MenuItem value={10}>{TGuatemalaBankAccount.Monetaria}</MenuItem>
              <MenuItem value={10}>{TGuatemalaBankAccount.Monetaria}</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            fullWidth
            label="Número de cuenta"
            placeholder="eg. 01-234567-89"
            variant="outlined"
            onChange={onSetAccountNumber}
            value={input.args.accountNumber}
            type="number"
            mb={3}
          />
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
