import {
  QueryGetTransactionBreakdownArgs,
  SetBitcoinTransactionReceiptEvidenceInput,
} from "@ibexcm/libraries/api";
import {
  Backdrop,
  Box,
  Container,
  Grid,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { DropzoneFile } from "dropzone";
import { DateTime } from "luxon";
import React from "react";
import { RouteComponentProps } from "react-router";
import { Sidebar, ToolbarPadding, Typography } from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { IPFSAddFileResponse } from "../../../libraries/ipfs";
import { CryptoToFiatTransaction, FiatToCryptoTransaction } from "../components";
import { TransactionRepositoryInjectionKeys } from "../InjectionKeys";

interface Props extends WithStyles, RouteComponentProps<{ id: string }> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKeys);
  const [error, setError] = React.useState<Error | null>(null);

  const transactionID = match.params.id;

  const {
    data,
    loading: isTransactionQueryLoading,
    error: getTransactionQueryError,
    refetch: refetchGetTransactionQuery,
  } = TransactionRepository.useGetTransactionQuery({
    args: { transactionID },
  });

  const [
    executeGetTransactionBreakdownQuery,
    getTransactionBreakdownState,
  ] = TransactionRepository.useGetTransactionBreakdownQuery();

  const {
    state: { loading: isSetTransactionReceiptEvidenceLoading },
    onAddFile: onAddTransactionReceiptEvidence,
    onUploadEnd: onTransactionReceiptEvidenceUploadEnd,
  } = TransactionRepository.useSetTransactionReceiptEvidenceMutation();

  const {
    updateTransactionMethods,
    state: adminUpdateTransactionState,
    setCryptoEvidenceID,
  } = TransactionRepository.useUpdateTransaction(transactionID);

  React.useEffect(() => {
    if (!Boolean(adminUpdateTransactionState.data?.adminUpdateTransaction)) {
      return;
    }

    refetchGetTransactionQuery();
  }, [adminUpdateTransactionState.data]);

  React.useEffect(() => {
    const evidence = data?.getTransaction?.receipt?.evidence;

    if (!Boolean(evidence)) {
      return;
    }

    const cryptoReceipt = evidence.filter((e) => Boolean(e.bitcoinReceipt));

    if (cryptoReceipt.length === 0) {
      return;
    }

    setCryptoEvidenceID(cryptoReceipt[cryptoReceipt.length - 1].bitcoinReceipt.id);
  }, [data]);

  const onAddFile = (file: DropzoneFile) => {
    onAddTransactionReceiptEvidence(file);
  };

  const onUploadEnd = async (response: IPFSAddFileResponse[]) => {
    const [{ hash: fileHash }] = response;
    try {
      await onTransactionReceiptEvidenceUploadEnd({
        args: { transactionID: transaction.id, fiat: { fileHash } },
      });

      refetchGetTransactionQuery({
        args: { transactionID: match.params.id },
      });
    } catch (error) {
      setError(error);
    }
  };

  const onSetCryptoTransactionEvidence = async ({
    transactionHash,
  }: SetBitcoinTransactionReceiptEvidenceInput) => {
    try {
      await onTransactionReceiptEvidenceUploadEnd({
        args: { transactionID: transaction.id, bitcoin: { transactionHash } },
      });

      refetchGetTransactionQuery({
        args: { transactionID: match.params.id },
      });
    } catch (error) {
      setError(error);
    }
  };

  const transaction = data?.getTransaction;
  const receipt = transaction?.receipt;
  const sender = transaction?.sender;
  const recipient = transaction?.recipient;

  React.useEffect(() => {
    if (isTransactionQueryLoading) {
      return;
    }

    const query: QueryGetTransactionBreakdownArgs = {
      args: {
        transactionID,
        amount: transaction.amount,
        sender: {
          cryptoAccountID: null,
          bankAccountID: null,
        },
        recipient: {
          cryptoAccountID: null,
          bankAccountID: null,
        },
      },
    };

    if (Boolean(sender?.bankAccount?.id)) {
      query.args.sender.bankAccountID = sender.bankAccount.id;
    } else {
      query.args.sender.cryptoAccountID = sender.cryptoAccount.id;
      query.args.recipient.bankAccountID = recipient.bankAccount.id;
    }

    executeGetTransactionBreakdownQuery(query);
  }, [isTransactionQueryLoading]);

  if (isTransactionQueryLoading) {
    return (
      <Backdrop className={classes.backdrop} open={isTransactionQueryLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const getTransactionComponent = () => {
    if (Boolean(recipient?.cryptoAccount)) {
      return (
        <CryptoToFiatTransaction
          transaction={transaction}
          getTransactionBreakdownState={getTransactionBreakdownState}
          onAddFile={onAddFile}
          onUploadEnd={onUploadEnd}
          updateTransactionMethods={updateTransactionMethods}
        />
      );
    }

    return (
      <FiatToCryptoTransaction
        transaction={transaction}
        getTransactionBreakdownState={getTransactionBreakdownState}
        onSetCryptoTransactionEvidence={onSetCryptoTransactionEvidence}
        updateTransactionMethods={updateTransactionMethods}
      />
    );
  };

  return (
    <Box className={classes.drawerContainer}>
      <Sidebar history={history}></Sidebar>
      <Container maxWidth={false} className={classes.mainContainer}>
        <ToolbarPadding />
        <Box mb={5}>
          <Grid container spacing={2}>
            <Grid item lg={6}>
              <Typography variant="h5">Detalles de la Transacción</Typography>
              <Box mt={1}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Fecha de emisión</Typography>
                    <Typography variant="body2">
                      {DateTime.fromISO(transaction.createdAt).toLocaleString(
                        DateTime.DATE_SHORT,
                      )}{" "}
                      {DateTime.fromISO(transaction.createdAt).toLocaleString(
                        DateTime.TIME_WITH_SHORT_OFFSET,
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Fecha de pago</Typography>
                    {Boolean(receipt?.paidAt) ? (
                      <Box>
                        <Typography variant="body2">
                          {DateTime.fromISO(receipt.paidAt).toLocaleString(
                            DateTime.DATE_SHORT,
                          )}{" "}
                          {DateTime.fromISO(receipt.paidAt).toLocaleString(
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
            <Grid item lg={6}></Grid>
          </Grid>
        </Box>
        <Box>{getTransactionComponent()}</Box>
      </Container>
    </Box>
  );
};

export const TransactionDetails = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
