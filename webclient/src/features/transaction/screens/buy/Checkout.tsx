import {
  MutationCreateBitcoinAccountArgs,
  QueryGetTransactionBreakdownArgs,
  SendPhoneNumberVerificationCodeInput,
} from "@ibexcm/libraries/api";
import {
  Box,
  Container,
  Grid,
  Hidden,
  InputAdornment,
  Paper,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { generatePath, RouteComponentProps, StaticContext } from "react-router";
import {
  Backdrop,
  Button,
  InputErrorBox,
  StepsSidebar,
  TextField,
  ToolbarPadding,
  Typography,
} from "../../../../common/components";
import DependencyContext from "../../../../common/contexts/DependencyContext";
import { styles } from "../../../../common/theme";
import routes from "../../../../routes";
import { useOnDebounceTextChange } from "../../../../utils";
import { BankAccountRepositoryInjectionKeys } from "../../../bankAccount/InjectionKeys";
import { UserRepositoryInjectionKeys } from "../../../user/InjectionKeys";
import { FiatToCryptoTransactionBreakdown, MobileNavBar } from "../../components";
import { TransactionRepositoryInjectionKeys } from "../../InjectionKeys";

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKeys);
  const UserRepository = dependencies.provide(UserRepositoryInjectionKeys);
  const BankAccountRepository = dependencies.provide(BankAccountRepositoryInjectionKeys);

  let intervalID;
  const [error, setError] = React.useState<Error>();
  const [recipientBankAccountID, setRecipientBankAccountID] = React.useState<string>();
  const [createBitcoinAccountInput, setCreateBitcoinAccountInput] = React.useState<
    MutationCreateBitcoinAccountArgs
  >({
    args: {
      address: "",
    },
  });
  const [input, setInput] = React.useState<QueryGetTransactionBreakdownArgs>({
    args: {
      amount: "0.00",
    },
  });

  const {
    data: userQueryData,
    loading: isUserQueryLoading,
    error: userQueryError,
    refetch: refetchUserQuery,
  } = UserRepository.useUserQuery();

  const {
    data: getAdminBankAccountsQueryData,
    loading: isGetAdminBankAccountsQueryLoading,
    error: getAdminBankAccountsQueryError,
  } = BankAccountRepository.useGetAdminBankAccountsQuery();

  const [
    executeGetTransactionBreakdownQuery,
    getTransactionBreakdownState,
  ] = TransactionRepository.useGetTransactionBreakdownQuery();

  const {
    execute: executeCreateTransactionMutation,
    state: createTransactionMutationState,
  } = TransactionRepository.useCreateTransactionMutation();

  const {
    execute: executeCreateBitcoinAccountMutation,
    state: { data: createBitcoinAccountData, loading: isCreatingBitcoinAccount },
  } = UserRepository.useCreateBitcoinAccountMutation();

  const execute = (cryptoAccountID: string) => {
    executeGetTransactionBreakdownQuery({
      args: {
        ...input.args,
        sender: { cryptoAccountID },
        recipient: { bankAccountID: recipientBankAccountID },
      },
    });
  };

  const shouldGetTransactionBreakdown =
    Boolean(userQueryData?.user?.cryptoAccounts) &&
    userQueryData?.user?.cryptoAccounts.length > 0 &&
    Boolean(getAdminBankAccountsQueryData?.getAdminBankAccounts) &&
    getAdminBankAccountsQueryData.getAdminBankAccounts.length > 0;

  React.useEffect(() => {
    if (!shouldGetTransactionBreakdown) {
      return;
    }

    const [{ id: cryptoAccountID }] = userQueryData.user.cryptoAccounts;

    const [
      { id: bankAccountID },
    ] = getAdminBankAccountsQueryData.getAdminBankAccounts.filter(
      (bankAccount) => bankAccount.currency.symbol === "GTQ",
    );

    setRecipientBankAccountID(bankAccountID);

    execute(cryptoAccountID);
  }, [userQueryData, getAdminBankAccountsQueryData]);

  React.useEffect(() => {
    if (!shouldGetTransactionBreakdown) {
      return;
    }

    if (intervalID) {
      clearInterval(intervalID);
    }

    const [{ id: cryptoAccountID }] = userQueryData.user.cryptoAccounts;

    intervalID = setInterval(() => {
      execute(cryptoAccountID);
    }, 15000);

    return () => clearInterval(intervalID);
  }, [input.args.amount, recipientBankAccountID]);

  const onDebounceTextChange = useOnDebounceTextChange(executeGetTransactionBreakdownQuery);

  if (isUserQueryLoading || isGetAdminBankAccountsQueryLoading) {
    return <Backdrop open />;
  }

  const {
    user: { cryptoAccounts },
  } = userQueryData;

  const isCryptoAccountSet = () => Boolean(cryptoAccounts) && cryptoAccounts.length > 0;

  const [
    {
      id: cryptoAccountID,
      bitcoin: { address },
      currency: cryptoCurrency,
    },
  ] = isCryptoAccountSet()
    ? cryptoAccounts
    : [{ id: undefined, bitcoin: { address: undefined }, currency: { symbol: undefined } }];

  const onCreateBitcoinAccount = async () => {
    setError(null);
    try {
      await executeCreateBitcoinAccountMutation(createBitcoinAccountInput);
      refetchUserQuery();
    } catch (error) {
      setError(error);
    }
  };

  const onSetCreateBitcoinAccountInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateBitcoinAccountInput((prev) => ({
      args: { address: event.currentTarget.value },
    }));
  };

  const onAmountChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    cryptoAccountID: string,
  ) => {
    try {
      const amount = event.target.value;

      setInput({ args: { amount } });

      onDebounceTextChange.current.cancel();
      onDebounceTextChange.current({
        args: { amount, sender: { cryptoAccountID } },
      });
    } catch (error) {
      // TODO handle error
      console.error(error);
    }
  };

  const onCancel = () => {
    history.push(routes.dashboard.transactions.index);
  };

  const onConfirm = async () => {
    try {
      const transaction = await executeCreateTransactionMutation({
        args: {
          amount: input.args.amount,
          sender: { cryptoAccountID },
          recipient: { bankAccountID: recipientBankAccountID },
        },
      });

      history.push(generatePath(routes.dashboard.buy.confirm, { id: transaction.id }));
    } catch (error) {
      // TODO handle error
    }
  };

  const getActions = () => (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button
          fullWidth
          color="default"
          size="large"
          variant="contained"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => {
            onConfirm();
          }}
        >
          Confirmar
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <Box className={classes.drawerContainer} position="relative">
      <StepsSidebar variant="primary"></StepsSidebar>
      <Container disableGutters maxWidth={false}>
        <MobileNavBar />
        <Box className={classes.topContainer}>
          <Container style={{ minHeight: "auto" }}>
            <ToolbarPadding />
            <Box mb={4}>
              <Typography variant="h5">Compra de Bitcoin</Typography>
              <Typography>
                Recibirás tu BTC en la dirección especificada una vez que confirmemos el
                depósito.
              </Typography>
            </Box>
          </Container>
        </Box>
        {!isCryptoAccountSet() ? (
          <Box className={classes.mainContainer}>
            <Container style={{ minHeight: "auto" }}>
              <Grid container justify="space-between">
                <Grid item xs={12} lg={5}>
                  <Box mb={3}>
                    <Paper>
                      <Box p={2}>
                        <TextField
                          fullWidth
                          autoFocus
                          label="Dirección BTC de destino"
                          variant="outlined"
                          onChange={onSetCreateBitcoinAccountInput}
                          disabled={isCreatingBitcoinAccount}
                          value={createBitcoinAccountInput.args.address}
                        />
                        <Box pt={2} pb={3}>
                          <Typography align="justify" variant="caption">
                            Por cuestiones regulatorias y de AML, sólo podrás cambiar la
                            dirección especificada 1 vez cada 3 meses.
                          </Typography>
                        </Box>
                        {error && <InputErrorBox error={error} />}
                        <Box display="flex" justifyContent="flex-end">
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={isCreatingBitcoinAccount}
                            onClick={onCreateBitcoinAccount}
                          >
                            {isCreatingBitcoinAccount ? "Guardando" : "Agregar dirección"}
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>
        ) : (
          <Box className={classes.mainContainer}>
            <Container style={{ minHeight: "auto" }}>
              <Grid container justify="space-between">
                <Grid item xs={12} lg={5}>
                  <Box mb={3}>
                    <Paper>
                      <TextField
                        fullWidth
                        label="¿Cuánto deseas comprar?"
                        variant="outlined"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">GTQ</InputAdornment>,
                        }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          onAmountChange(event, cryptoAccountID);
                        }}
                        value={input.args.amount}
                        type="number"
                      />
                    </Paper>
                  </Box>
                  <Box mb={3}>
                    <Paper>
                      <Box p={2}>
                        <Typography variant="body2" mb={3}>
                          Dirección {cryptoCurrency.symbol} de destino
                        </Typography>
                        <Box overflow="scroll">
                          <Typography variant="h6">{address}</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={5}>
                  <FiatToCryptoTransactionBreakdown
                    getTransactionBreakdownState={getTransactionBreakdownState}
                  />
                  <Box mb={3}>
                    <Typography align="justify" variant="caption">
                      Al dar click en "Confirmar", comprendo que debido a las fluctuaciones
                      del precio de Bitcoin, puedo recibir una cantidad mayor o menor a la
                      especificada en el desglose anterior.
                    </Typography>
                  </Box>
                  <Hidden smDown>
                    <Box>{getActions()}</Box>
                  </Hidden>
                </Grid>
              </Grid>
            </Container>
          </Box>
        )}
        {isCryptoAccountSet() && (
          <Hidden smUp>
            <Box className={classes.fixedActionsContainer}>
              <Container style={{ minHeight: "auto" }}>{getActions()}</Container>
            </Box>
          </Hidden>
        )}
      </Container>
    </Box>
  );
};

export const Checkout = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
