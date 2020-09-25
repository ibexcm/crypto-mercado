import {
  SendPhoneNumberVerificationCodeInput,
  Transaction,
  TransactionOrderByInput,
} from "@ibexcm/libraries/api";
import {
  Backdrop,
  Box,
  Container,
  Paper,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import { generatePath, RouteComponentProps, StaticContext } from "react-router";
import { Sidebar, ToolbarPadding, Typography } from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import routes from "../../../routes";
import { TransactionIndexTable } from "../components";
import { TransactionRepositoryInjectionKeys } from "../InjectionKeys";

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKeys);

  const { data, loading, error } = TransactionRepository.useAdminGetTransactionsQuery({
    args: {
      where: {
        sender: {
          cryptoAccount: {
            id_not: null,
          },
        },
        recipient: {
          bankAccount: {
            id_not: null,
          },
        },
      },
      orderBy: TransactionOrderByInput.CreatedAtDesc,
    },
  });

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const transactions = data.adminGetTransactions;

  const onEvaluate = (transaction: Transaction) => {
    history.push(generatePath(routes.transaction.details, { id: transaction.id }));
  };

  return (
    <Box className={classes.drawerContainer}>
      <Sidebar history={history}></Sidebar>
      <Container maxWidth={false} className={classes.mainContainer}>
        <ToolbarPadding />
        <Box mb={3}>
          <Typography variant="h5">Transacciones de Compra</Typography>
          <Typography>Fiat a Crypto</Typography>
        </Box>
        <Paper>
          <TransactionIndexTable transactions={transactions} onClick={onEvaluate} />
        </Paper>
      </Container>
    </Box>
  );
};

export const FiatToCryptoTransactionsIndex = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
