import { LazyQueryResult } from "@apollo/client";
import { QueryGetTransactionBreakdownArgs } from "@ibexcm/libraries/api";
import {
  Box,
  Grid,
  InputAdornment,
  Paper,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { TransactionBreakdown } from ".";
import { IDropzoneProps, TextField, Typography } from "../../../common/components";
import { styles } from "../../../common/theme";
import { Query, Transaction } from "../../../libraries/api";
import { IUpdateTransactionMethods } from "../interfaces/IUpdateTransactionMethods";
import { CryptoToFiatTransactionEvidence } from "./CryptoToFiatTransactionEvidence";

interface Props extends WithStyles, IDropzoneProps {
  transaction: Transaction;
  getTransactionBreakdownState: LazyQueryResult<
    Pick<Query, "getTransactionBreakdown">,
    QueryGetTransactionBreakdownArgs
  >;
  updateTransactionMethods: IUpdateTransactionMethods;
}

const Component: React.FC<Props> = ({
  classes,
  transaction,
  getTransactionBreakdownState,
  onAddFile,
  onUploadEnd,
  updateTransactionMethods,
  ...props
}) => {
  const [amount, setAmount] = React.useState(transaction.amount);

  const {
    id,
    createdAt,
    sender,
    recipient,
    receipt: { paidAt },
  } = transaction;

  const {
    currency: cryptoCurrency,
    bitcoin: { address },
  } = recipient.cryptoAccount;

  const {
    currency,
    guatemala: { accountNumber, fullName, bankAccountType, bank },
  } = sender.bankAccount;

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    updateTransactionMethods.onSetAmount(amount);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <Grid container justify="space-between">
      <Grid item xs={12} lg={5}>
        <Box mb={3}>
          <Paper>
            <TextField
              fullWidth
              onChange={onChange}
              onBlur={onBlur}
              label="Cantidad"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{cryptoCurrency.symbol}</InputAdornment>
                ),
              }}
              value={amount}
              type="number"
            />
          </Paper>
          {!Boolean(paidAt) && (
            <Box mt={1}>
              <Typography align="justify" variant="caption">
                La cantidad no es definitiva y será temporal hasta que la transacción cumpla
                el número mínimo de confirmaciones en la red de {cryptoCurrency.name}.
              </Typography>
            </Box>
          )}
        </Box>
        <TransactionBreakdown
          getTransactionBreakdownState={getTransactionBreakdownState}
          updateTransactionMethods={updateTransactionMethods}
        />
      </Grid>
      <Grid item xs={12} lg={5}>
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
        <CryptoToFiatTransactionEvidence
          transaction={transaction}
          onAddFile={onAddFile}
          onUploadEnd={onUploadEnd}
        />
      </Grid>
    </Grid>
  );
};

export const CryptoToFiatTransaction = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
