import { SendPhoneNumberVerificationCodeInput, Transaction } from "@ibexcm/libraries/api";
import {
  Backdrop,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { DateTime } from "luxon";
import React from "react";
import { generatePath, RouteComponentProps, StaticContext } from "react-router";
import { Button, Sidebar, ToolbarPadding, Typography } from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { TransactionOrderByInput } from "../../../libraries/api";
import routes from "../../../routes";
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
      <Container maxWidth="lg" className={classes.mainContainer}>
        <ToolbarPadding />
        <Box mb={3}>
          <Typography variant="h5">Transacciones de Compra</Typography>
          <Typography>Fiat a Crypto</Typography>
        </Box>
        <Paper>
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Divisa</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Tasa</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              {!Boolean(error) && Boolean(transactions.length > 0) && (
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {transaction.sender.user.contact.email[0].address}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="row">
                          <Box className={classes.rowItemBox}>
                            <Typography variant="body2" color="secondary">
                              {transaction.receipt.fromCurrency.symbol}
                            </Typography>
                          </Box>
                          <Box className={classes.rowItemBox}>
                            <ArrowRightAltIcon color="disabled" />
                          </Box>
                          <Box className={classes.rowItemBox}>
                            <Typography variant="body2" color="primary">
                              {transaction.receipt.toCurrency.symbol}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{transaction.amount}</TableCell>
                      <TableCell align="right">{`${(
                        Number(transaction.receipt.fee.fee) * 100
                      ).toFixed(2)}%`}</TableCell>
                      <TableCell>
                        {DateTime.fromISO(transaction.createdAt).toLocaleString(
                          DateTime.DATE_SHORT,
                        )}{" "}
                        {DateTime.fromISO(transaction.createdAt).toLocaleString(
                          DateTime.TIME_WITH_SHORT_OFFSET,
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            onEvaluate(transaction);
                          }}
                        >
                          Evaluar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export const FiatToCryptoTransactionsIndex = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
