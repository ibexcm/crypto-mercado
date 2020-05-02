import {
  Box,
  Container,
  Grid,
  Hidden,
  Paper,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { RouteComponentProps } from "react-router";
import {
  Backdrop,
  Button,
  StepsSidebar,
  ToolbarPadding,
  Typography,
} from "../../../../common/components";
import DependencyContext from "../../../../common/contexts/DependencyContext";
import { styles } from "../../../../common/theme";
import routes from "../../../../routes";
import { MobileNavBar } from "../../components";
import { TransactionRepositoryInjectionKeys } from "../../InjectionKeys";

interface Props extends WithStyles, RouteComponentProps<{ id: string }> {}

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

  if (isTransactionQueryLoading) {
    return <Backdrop open={isTransactionQueryLoading} />;
  }

  const {
    id,
    createdAt,
    amount,
    sender,
    recipient,
    receipt,
  } = getTransactionQueryData.getTransaction;

  const {
    currency,
    guatemala: { accountNumber, bankAccountType, fullName, bank },
  } = recipient.bankAccount;

  const {
    account: { clientID },
  } = sender.user;

  const onFinish = () => {
    history.push(routes.dashboard.transactions.index);
  };

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
        <Box className={classes.mainContainer}>
          <Container style={{ minHeight: "auto" }}>
            <Grid container justify="space-between">
              <Grid item lg={4} xs={12}>
                <Box mb={3}>
                  <Paper>
                    <Box p={2}>
                      <Typography variant="body2" mb={3}>
                        Su número de cliente:
                      </Typography>
                      <Box>
                        <Typography variant="h6" mb={2}>
                          {clientID}
                        </Typography>
                        <Typography color="textSecondary">
                          IMPORTANTE: Especifique su número de cliente en la boleta de la
                          transacción.
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
                <Box mb={3}>
                  <Paper>
                    <Box p={2}>
                      <Typography variant="body2" mb={3}>
                        Favor de realizar el depósito a la cuenta:
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
              </Grid>
              <Grid item lg={5} xs={12}>
                <Typography gutterBottom>
                  IBEX Mercado estará atento a la confirmación de la transacción. Tenga en
                  cuenta que el precio de BTC se determina en la fecha y hora de la
                  transacción.
                </Typography>
                <Hidden smDown>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={onFinish}
                  >
                    Terminar
                  </Button>
                </Hidden>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Hidden smUp>
          <Box className={classes.fixedActionsContainer}>
            <Container style={{ minHeight: "auto" }}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                onClick={onFinish}
              >
                Terminar
              </Button>
            </Container>
          </Box>
        </Hidden>
      </Container>
    </Box>
  );
};

export const Confirm = withStyles((theme: Theme) => ({
  ...styles(theme),
  cryptoAddress: {
    backgroundColor: theme.palette.secondary.main,
    "& p": {
      color: theme.palette.warning.main,
    },
  },
}))(Component);
