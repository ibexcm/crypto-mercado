import {
  Box,
  Grid,
  Paper,
  TextField,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { Button, Typography } from "../../../common/components";
import { styles } from "../../../common/theme";
import { Transaction } from "../../../libraries/api";
import { ICryptoTransactionEvidenceCallback } from "../interfaces/ICryptoTransactionEvidenceCallback";

interface Props extends WithStyles, ICryptoTransactionEvidenceCallback {
  transaction: Transaction;
}

const Component: React.FC<Props> = ({
  classes,
  onSetCryptoTransactionEvidence,
  transaction,
  ...props
}) => {
  const [transactionHash, setTransactionHash] = React.useState<string | undefined>(
    undefined,
  );

  const {
    receipt: { evidence },
  } = transaction;

  const bankReceiptEvidence = evidence.map((type) => {
    if (Boolean(type?.bankReceipt)) {
      return type.bankReceipt;
    }
  });

  const bitcoinReceiptEvidence = evidence.map((type) => {
    if (Boolean(type?.bitcoinReceipt)) {
      return type.bitcoinReceipt;
    }
  });

  const onChangeTransactionHash = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setTransactionHash(value);
  };

  return (
    <Box mb={3}>
      <Paper>
        <Box p={2}>
          <Typography variant="body2">Evidencia</Typography>
          <Typography variant="body2" mb={3} color="textSecondary">
            Nota: La transacción se marcará como "pagada" en la fecha y hora si IBEX ingresa
            el ID de la transacción.
          </Typography>
          <Box mb={2}>
            <Typography gutterBottom>ID de la transacción</Typography>
            <Grid container spacing={2}>
              <Grid item lg={8}>
                <TextField
                  fullWidth
                  label="ID de la transacción"
                  variant="outlined"
                  onChange={onChangeTransactionHash}
                  value={transactionHash}
                />
              </Grid>
              <Grid item lg={4}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    onSetCryptoTransactionEvidence({ transactionHash });
                  }}
                >
                  Guardar
                </Button>
              </Grid>
            </Grid>
            {bitcoinReceiptEvidence.length > 0 && (
              <Box mt={2}>
                <Grid container spacing={2}>
                  {bitcoinReceiptEvidence.map((bitcoin, index) => (
                    <Grid item key={index}>
                      <a
                        href={`https://blockchair.com/bitcoin/transaction/${bitcoin.transactionHash}`}
                        target="_blank"
                        className={classes.anchorButton}
                      >
                        <Button variant="outlined">
                          <Typography noWrap style={{ width: 140 }}>
                            {bitcoin.transactionHash}
                          </Typography>
                        </Button>
                      </a>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
          <Box>
            <Typography>Recibo de depósito bancario</Typography>
            <Typography variant="h6">PENDIENTE</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export const FiatToCryptoTransactionEvidence = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);