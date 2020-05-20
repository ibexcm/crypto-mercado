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

  const bankReceiptEvidence = evidence.map((type) => {
    if (Boolean(type?.bankReceipt)) {
      return type.bankReceipt;
    }
  });

  return (
    <Box mb={3}>
      <Paper>
        <Box p={2}>
          <Typography variant="body2">Evidencia</Typography>
          <Typography variant="body2" mb={3} color="textSecondary">
            Nota: Al subir un documento de evidencia de depósito bancario al emisor, la
            transacción se marcará como "pagada" en la fecha y hora de la carga del
            documento si existe evidencia por parte del emisor, en este caso, el ID de la
            transacción.
          </Typography>
          <Box mb={2}>
            <Typography>ID de la transacción</Typography>
            <Typography variant="h6">PENDIENTE</Typography>
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
        </Box>
      </Paper>
    </Box>
  );
};

export const CryptoToFiatTransactionEvidence = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
