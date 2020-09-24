import { Transaction } from "@ibexcm/libraries/api";
import {
  Box,
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
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { DateTime } from "luxon";
import React from "react";
import { Button, Typography } from "../../../common/components";
import { styles } from "../../../common/theme";

interface Props extends WithStyles {
  transactions: Transaction[];
  onClick: (transaction: Transaction) => void;
}

const Component: React.FC<Props> = ({ classes, transactions, onClick, ...props }) => {
  return (
    <TableContainer className={classes.tableContainer}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell>Divisa</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell align="right">Tasa</TableCell>
            <TableCell>Fecha de Emisión</TableCell>
            <TableCell>Fecha de Pago</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        {Boolean(transactions.length > 0) && (
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.sender.user.contact.email[0].address}</TableCell>
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
                  {Boolean(transaction?.receipt?.paidAt) && (
                    <>
                      {DateTime.fromISO(transaction.receipt.paidAt).toLocaleString(
                        DateTime.DATE_SHORT,
                      )}{" "}
                      {DateTime.fromISO(transaction.receipt.paidAt).toLocaleString(
                        DateTime.TIME_WITH_SHORT_OFFSET,
                      )}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      onClick(transaction);
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
  );
};

export const TransactionIndexTable = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
