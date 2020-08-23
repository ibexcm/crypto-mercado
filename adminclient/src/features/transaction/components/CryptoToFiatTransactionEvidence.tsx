import { Box, Grid, Paper, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import {
  Button,
  Dropzone,
  DropzonePreview,
  IDropzoneProps,
  Typography,
} from "../../../common/components";
import { styles } from "../../../common/theme";
import { Transaction } from "../../../libraries/api";
import {
  getBankReceiptEvidence,
  getBitcoinReceiptEvidence,
} from "../../../libraries/utilities/transaction";

interface Props extends WithStyles, IDropzoneProps {
  transaction: Transaction;
}

const Component: React.FC<Props> = ({
  classes,
  onAddFile,
  onUploadEnd,
  transaction,
  ...props
}) => {
  const {
    receipt: { evidence },
  } = transaction;

  const bankReceiptEvidence = getBankReceiptEvidence(evidence);
  const bitcoinReceiptEvidence = getBitcoinReceiptEvidence(evidence);

  return (
    <Box mb={3}>
      <Paper>
        <Box p={2}>
          <Typography variant="body2">Evidencia</Typography>
          <Box mb={2}>
            <Typography>ID de la transacción</Typography>
            {bitcoinReceiptEvidence.length > 0 ? (
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
            ) : (
              <Typography variant="h6">PENDIENTE</Typography>
            )}
          </Box>
          <Box>
            <Typography gutterBottom>Recibo de depósito bancario</Typography>
            <Box>
              <Dropzone
                onAddFile={onAddFile}
                onUploadEnd={onUploadEnd}
                message={
                  <Typography>
                    Arrastra o selecciona
                    <br />
                    PDF, PNG ó JPG
                  </Typography>
                }
              />
            </Box>
            {bankReceiptEvidence.length > 0 && (
              <Box mt={2}>
                <Grid container spacing={2}>
                  {bankReceiptEvidence.map((file, index) => (
                    <Grid item key={index}>
                      <a
                        href={`https://ipfs.infura.io/ipfs/${file?.fileHash}`}
                        target="_blank"
                        className={classes.anchorButton}
                      >
                        <Button variant="outlined">Evidencia ({index + 1})</Button>
                      </a>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            <Box mt={2}>
              <DropzonePreview />
            </Box>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary">
              Marcar como pagada
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export const CryptoToFiatTransactionEvidence = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
