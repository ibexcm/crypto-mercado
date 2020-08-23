import {
  QueryGetTransactionBreakdownArgs,
  SendPhoneNumberVerificationCodeInput,
  SetBitcoinTransactionReceiptEvidenceInput,
} from "@ibexcm/libraries/api";
import { Box, Container, Grid, Theme, withStyles, WithStyles } from "@material-ui/core";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { DropzoneFile } from "dropzone";
import { DateTime } from "luxon";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import {
  Backdrop,
  StepsSidebar,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { IPFSAddFileResponse } from "../../../libraries/ipfs";
import {
  CryptoToFiatTransaction,
  FiatToCryptoTransaction,
  MobileNavBar,
} from "../components";
import { TransactionRepositoryInjectionKeys } from "../InjectionKeys";

interface Props
  extends WithStyles,
    RouteComponentProps<
      { id: string },
      StaticContext,
      SendPhoneNumberVerificationCodeInput
    > {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKeys);

  const [error, setError] = React.useState<Error | null>(null);

  const transactionID = match.params.id;

  const {
    data: getTransactionQueryData,
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

  React.useEffect(() => {
    if (isTransactionQueryLoading) {
      return;
    }

    const query: QueryGetTransactionBreakdownArgs = {
      args: {
        transactionID,
        amount,
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

  const onAddFile = (file: DropzoneFile) => {
    onAddTransactionReceiptEvidence(file);
  };

  const onUploadEnd = async (response: IPFSAddFileResponse[]) => {
    console.log(response);
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

  if (isTransactionQueryLoading) {
    return <Backdrop open={isTransactionQueryLoading} />;
  }

  const transaction = getTransactionQueryData.getTransaction;

  const {
    id,
    createdAt,
    amount,
    sender,
    recipient,
    receipt: { paidAt },
  } = transaction;

  const getTransactionComponent = () => {
    if (Boolean(recipient?.cryptoAccount)) {
      return (
        <CryptoToFiatTransaction
          transaction={transaction}
          getTransactionBreakdownState={getTransactionBreakdownState}
          onSetCryptoTransactionEvidence={onSetCryptoTransactionEvidence}
        />
      );
    }

    return (
      <FiatToCryptoTransaction
        transaction={transaction}
        getTransactionBreakdownState={getTransactionBreakdownState}
        onAddFile={onAddFile}
        onUploadEnd={onUploadEnd}
      />
    );
  };

  return (
    <Box className={classes.drawerContainer} position="relative">
      <StepsSidebar variant="primary"></StepsSidebar>
      <Container disableGutters maxWidth={false}>
        <MobileNavBar />
        <Box className={classes.topContainer}>
          <Container style={{ minHeight: "auto" }}>
            <ToolbarPadding />
            <Box mb={2}>
              <Grid container spacing={2}>
                <Grid item lg={6}>
                  <Typography variant="h5">Detalles de la Transacción</Typography>
                  <Box mt={1}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">Fecha de emisión</Typography>
                        <Typography variant="body2">
                          {DateTime.fromISO(createdAt).toLocaleString(DateTime.DATE_SHORT)}{" "}
                          {DateTime.fromISO(createdAt).toLocaleString(
                            DateTime.TIME_WITH_SHORT_OFFSET,
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">Fecha de pago</Typography>
                        {Boolean(paidAt) ? (
                          <Box>
                            <Typography variant="body2">
                              {DateTime.fromISO(paidAt).toLocaleString(DateTime.DATE_SHORT)}{" "}
                              {DateTime.fromISO(paidAt).toLocaleString(
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
              </Grid>
            </Box>
          </Container>
        </Box>
        <Box className={classes.mainContainer}>
          <Container style={{ minHeight: "auto" }}>{getTransactionComponent()}</Container>
        </Box>
      </Container>
    </Box>
  );
};

export const TransactionDetails = withStyles((theme: Theme) => ({
  ...styles(theme),
  rowItemBox: {
    ...styles(theme).rowItemBox,
    minHeight: 24,
  },
}))(Component);
