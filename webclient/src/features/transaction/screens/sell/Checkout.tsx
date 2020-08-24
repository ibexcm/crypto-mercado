import {
  BankAccount,
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
  StepsSidebar,
  TextField,
  ToolbarPadding,
  Typography,
} from "../../../../common/components";
import DependencyContext from "../../../../common/contexts/DependencyContext";
import { styles } from "../../../../common/theme";
import routes from "../../../../routes";
import { useOnDebounceTextChange } from "../../../../utils";
import { UserRepositoryInjectionKeys } from "../../../user/InjectionKeys";
import { MobileNavBar, TransactionBreakdown } from "../../components";
import { TransactionRepositoryInjectionKeys } from "../../InjectionKeys";

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKeys);
  const UserRepository = dependencies.provide(UserRepositoryInjectionKeys);

  let intervalID;
  const [input, setInput] = React.useState<QueryGetTransactionBreakdownArgs>({
    args: {
      amount: "0.00",
    },
  });

  const {
    data: userQueryData,
    loading: isUserQueryLoading,
    error: userQueryError,
  } = UserRepository.useUserQuery();

  const [
    executeGetTransactionBreakdownQuery,
    getTransactionBreakdownState,
  ] = TransactionRepository.useGetTransactionBreakdownQuery();

  const {
    execute: executeCreateTransactionMutation,
    state: createTransactionMutationState,
  } = TransactionRepository.useCreateTransactionMutation();

  const execute = (bankAccountID: string) => {
    executeGetTransactionBreakdownQuery({
      args: { ...input.args, sender: { bankAccountID } },
    });
  };

  React.useEffect(() => {
    if (!Boolean(userQueryData?.user?.bankAccounts)) {
      return;
    }

    const [{ id: bankAccountID }] = userQueryData.user.bankAccounts;
    execute(bankAccountID);
  }, [userQueryData]);

  React.useEffect(() => {
    if (!Boolean(userQueryData?.user?.bankAccounts)) {
      return;
    }

    if (intervalID) {
      clearInterval(intervalID);
    }

    const [{ id: bankAccountID }] = userQueryData.user.bankAccounts;

    intervalID = setInterval(() => {
      execute(bankAccountID);
    }, 15000);

    return () => clearInterval(intervalID);
  }, [input.args.amount]);

  const onDebounceTextChange = useOnDebounceTextChange(executeGetTransactionBreakdownQuery);

  if (isUserQueryLoading) {
    return <Backdrop open={isUserQueryLoading} />;
  }

  const onCancel = () => {
    history.push(routes.dashboard.transactions.index);
  };

  const onConfirm = async (bankAccountID: string) => {
    try {
      const transaction = await executeCreateTransactionMutation({
        args: { amount: input.args.amount, sender: { bankAccountID } },
      });

      history.push(
        generatePath(routes.dashboard.transactions.details, { id: transaction.id }),
      );
    } catch (error) {
      // TODO handle error
    }
  };

  const onAmountChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    bankAccountID: string,
  ) => {
    try {
      const amount = event.target.value;

      setInput({ args: { amount } });

      onDebounceTextChange.current.cancel();
      onDebounceTextChange.current({
        args: { amount, sender: { bankAccountID } },
      });
    } catch (error) {
      // TODO handle error
      console.error(error);
    }
  };

  const getActions = (bankAccount: BankAccount) => (
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
            onConfirm(bankAccount.id);
          }}
        >
          Confirmar
        </Button>
      </Grid>
    </Grid>
  );

  const { bankAccounts } = userQueryData.user;
  const [bankAccount] = bankAccounts;
  const { guatemala: guatemalaBankAccount } = bankAccount;

  return (
    <Box className={classes.drawerContainer} position="relative">
      <StepsSidebar variant="primary"></StepsSidebar>
      <Container disableGutters maxWidth={false}>
        <MobileNavBar />
        <Box className={classes.topContainer}>
          <Container style={{ minHeight: "auto" }}>
            <ToolbarPadding />
            <Box mb={4}>
              <Typography variant="h5">Venta de Bitcoin</Typography>
              <Typography>
                Recibirás tu dinero en la cuenta bancaria especificada dentro de un plazo de
                24 horas.
              </Typography>
            </Box>
          </Container>
        </Box>
        <Box className={classes.mainContainer}>
          <Container style={{ minHeight: "auto" }}>
            <Grid container justify="space-between">
              <Grid item xs={12} lg={5}>
                <Box mb={3}>
                  <Paper>
                    <TextField
                      fullWidth
                      label="¿Cuánto deseas vender?"
                      variant="outlined"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
                      }}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        onAmountChange(event, bankAccount.id);
                      }}
                      value={input.args.amount}
                      type="number"
                    />
                  </Paper>
                </Box>
                <TransactionBreakdown
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
                  <Box>{getActions(bankAccount)}</Box>
                </Hidden>
              </Grid>
              <Grid item xs={12} lg={5}>
                <Box mb={3}>
                  <Paper>
                    <Box p={2}>
                      <Typography variant="body2" mb={3}>
                        Cuenta bancaria de destino
                      </Typography>
                      <Box>
                        <Typography variant="h6">
                          {guatemalaBankAccount.accountNumber}
                        </Typography>
                        <Typography>{guatemalaBankAccount.fullName}</Typography>
                        <Typography>
                          {guatemalaBankAccount.bankAccountType},{" "}
                          {bankAccount.currency.symbol}
                        </Typography>
                        <Typography color="textSecondary">
                          {guatemalaBankAccount.bank.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Hidden smUp>
          <Box className={classes.fixedActionsContainer}>
            <Container style={{ minHeight: "auto" }}>{getActions(bankAccount)}</Container>
          </Box>
        </Hidden>
      </Container>
    </Box>
  );
};

export const Checkout = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
