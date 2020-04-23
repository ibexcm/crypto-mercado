import { SendPhoneNumberVerificationCodeInput } from "@ibexcm/libraries/api";
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
import ScheduleIcon from "@material-ui/icons/Schedule";
import { DateTime } from "luxon";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import {
  Backdrop,
  StepsSidebar,
  TextField,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { MobileNavBar, OnSellTransactionBreakdown } from "../components";
import { TransactionRepositoryInjectionKeys } from "../InjectionKeys";

interface Props
  extends WithStyles,
    RouteComponentProps<
      { id: string },
      StaticContext,
      SendPhoneNumberVerificationCodeInput
    > {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKeys);

  const {
    data: getTransactionQueryData,
    loading: isTransactionQueryLoading,
    error: getTransactionQueryError,
  } = TransactionRepository.useGetTransactionQuery({
    args: { transactionID: match.params.id },
  });

  const [
    executeGetTransactionBreakdownQuery,
    getTransactionBreakdownState,
  ] = TransactionRepository.useGetTransactionBreakdownQuery();

  React.useEffect(() => {
    if (isTransactionQueryLoading) {
      return;
    }

    executeGetTransactionBreakdownQuery({
      args: { amount, sender: { bankAccountID: sender.bankAccount.id } },
    });
  }, [isTransactionQueryLoading]);

  if (isTransactionQueryLoading) {
    return <Backdrop open={isTransactionQueryLoading} />;
  }

  const {
    id,
    createdAt,
    amount,
    sender,
    recipient,
    receipt: { paidAt },
  } = getTransactionQueryData.getTransaction;

  const {
    currency: cryptoCurrency,
    bitcoin: { address },
  } = recipient.cryptoAccount;

  const {
    currency,
    guatemala: { accountNumber, fullName, bankAccountType, bank },
  } = sender.bankAccount;

  return (
    <Box className={classes.drawerContainer} position="relative">
      <StepsSidebar variant="primary"></StepsSidebar>
      <Container disableGutters maxWidth={false}>
        <MobileNavBar />
        <Box className={classes.topContainer}>
          <Container style={{ minHeight: "auto" }}>
            <ToolbarPadding />
            <Box mb={2}>
              <Grid container spacing={2}>
                <Grid item lg={6}>
                  <Typography variant="h5">Detalles de la Transacción</Typography>
                  <Box mt={1}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">Fecha de emisión</Typography>
                        <Typography variant="body2">
                          {DateTime.fromISO(createdAt).toLocaleString(DateTime.DATE_SHORT)}{" "}
                          {DateTime.fromISO(createdAt).toLocaleString(
                            DateTime.TIME_WITH_SHORT_OFFSET,
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Fecha de pago</Typography>
                        {Boolean(paidAt) ? (
                          <Box>
                            <Typography variant="body2">
                              {DateTime.fromISO(paidAt).toLocaleString(DateTime.DATE_SHORT)}{" "}
                              {DateTime.fromISO(paidAt).toLocaleString(
                                DateTime.TIME_WITH_SHORT_OFFSET,
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <Box display="flex" flexDirection="row">
                            <Box className={classes.rowItemBox}>
                              <ScheduleIcon fontSize="small" color="primary" />
                            </Box>
                            <Box className={classes.rowItemBox} pl={1}>
                              <Typography color="primary" variant="body2">
                                Pendiente
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
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
                      disabled
                      label="Cantidad"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {cryptoCurrency.symbol}
                          </InputAdornment>
                        ),
                      }}
                      value={amount}
                      type="number"
                    />
                  </Paper>
                  {!Boolean(paidAt) && (
                    <Box mt={1}>
                      <Typography align="justify" variant="caption">
                        La cantidad no es definitiva y será temporal hasta que la
                        transacción cumpla el número mínimo de confirmaciones en la red de{" "}
                        {cryptoCurrency.name}.
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box mb={3}>
                  <Paper>
                    <Box p={2}>
                      <Typography variant="body2" mb={3}>
                        Cuenta bancaria de destino
                      </Typography>
                      <Box>
                        <Typography variant="h6">{accountNumber}</Typography>
                        <Typography>{fullName}</Typography>
                        <Typography>
                          {bankAccountType}, {currency.symbol}
                        </Typography>
                        <Typography color="textSecondary">{bank.name}</Typography>
                      </Box>
                    </Box>
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
                <OnSellTransactionBreakdown
                  getTransactionBreakdownState={getTransactionBreakdownState}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export const TransactionDetails = withStyles((theme: Theme) => ({
  ...styles(theme),
  rowItemBox: {
    ...styles(theme).rowItemBox,
    minHeight: 24,
  },
}))(Component);
