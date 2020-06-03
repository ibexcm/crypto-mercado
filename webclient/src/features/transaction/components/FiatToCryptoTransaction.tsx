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
import { IDropzoneProps, TextField, Typography } from "../../../common/components";
import { styles } from "../../../common/theme";
import { Query, Transaction } from "../../../libraries/api";
import { FiatToCryptoTransactionBreakdown } from "./FiatToCryptoTransactionBreakdown";
import { FiatToCryptoTransactionEvidence } from "./FiatToCryptoTransactionEvidence";

interface Props extends WithStyles, IDropzoneProps {
  transaction: Transaction;
  getTransactionBreakdownState: LazyQueryResult<
    Pick<Query, "getTransactionBreakdown">,
    QueryGetTransactionBreakdownArgs
  >;
}

const Component: React.FC<Props> = ({
  classes,
  transaction,
  getTransactionBreakdownState,
  onAddFile,
  onUploadEnd,
  ...props
}) => {
  const {
    amount,
    sender,
    recipient,
    receipt: { paidAt },
  } = transaction;

  const {
    currency: recipientBankAccountCurrency,
    guatemala: { accountNumber, bankAccountType, fullName, bank },
  } = recipient.bankAccount;

  const {
    currency: senderCryptoAccountCurrency,
    bitcoin: { address },
  } = sender.cryptoAccount;

  const {
    account: { clientID },
  } = sender.user;

  return (
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
                    {recipientBankAccountCurrency.symbol}
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
                La cantidad no es definitiva y será temporal hasta que la transacción cumpla
                el número mínimo de confirmaciones en la red de{" "}
                {senderCryptoAccountCurrency.name}.
              </Typography>
            </Box>
          )}
        </Box>
        <Box mb={3}>
          <Paper>
            <Box p={2}>
              <Typography variant="body2" mb={3}>
                Dirección {senderCryptoAccountCurrency.symbol} de destino
              </Typography>
              <Box overflow="scroll">
                <Typography variant="h6">{address}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
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
                  {bankAccountType}, {recipientBankAccountCurrency.symbol}
                </Typography>
                <Typography color="textSecondary">{bank.name}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={12} lg={5}>
        <FiatToCryptoTransactionBreakdown
          getTransactionBreakdownState={getTransactionBreakdownState}
        />
        <FiatToCryptoTransactionEvidence
          transaction={transaction}
          onAddFile={onAddFile}
          onUploadEnd={onUploadEnd}
        />
      </Grid>
    </Grid>
  );
};

export const FiatToCryptoTransaction = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
