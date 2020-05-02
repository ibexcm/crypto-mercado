import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Hidden,
  Paper,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import QRCode from "qrcode";
import React from "react";
import { RouteComponentProps } from "react-router";
import {
  Backdrop,
  Button,
  StepsSidebar,
  ToolbarPadding,
  Typography,
} from "../../../../common/components";
import DependencyContext from "../../../../common/contexts/DependencyContext";
import { styles } from "../../../../common/theme";
import routes from "../../../../routes";
import { MobileNavBar } from "../../components";
import { TransactionRepositoryInjectionKeys } from "../../InjectionKeys";

interface Props extends WithStyles, RouteComponentProps<{ id: string }> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKeys);

  const [qrcodeDataURL, setQRCodeDataURL] = React.useState(null);

  const {
    data: getTransactionQueryData,
    loading: isTransactionQueryLoading,
    error: getTransactionQueryError,
  } = TransactionRepository.useGetTransactionQuery({
    args: { transactionID: match.params.id },
  });

  React.useEffect(() => {
    const loadQRCode = async (address, amount) => {
      try {
        const url = await QRCode.toDataURL(`bitcoin:${address}?amount=${amount}`, {
          margin: 1,
          quality: 1,
        });
        setQRCodeDataURL(url);
      } catch (error) {
        console.error(error);
      }
    };

    if (!Boolean(getTransactionQueryData?.getTransaction)) {
      loadQRCode("", "0.00");
      return;
    }

    const { amount, recipient } = getTransactionQueryData.getTransaction;

    const {
      bitcoin: { address },
    } = recipient.cryptoAccount;

    loadQRCode(address, amount);
  }, [getTransactionQueryData]);

  if (isTransactionQueryLoading) {
    return <Backdrop open={isTransactionQueryLoading} />;
  }

  const {
    id,
    createdAt,
    amount,
    sender,
    recipient,
    receipt,
  } = getTransactionQueryData.getTransaction;

  const {
    currency: { symbol },
    bitcoin: { address },
  } = recipient.cryptoAccount;

  const onFinish = () => {
    history.push(routes.dashboard.transactions.index);
  };

  const getWarningBlock = () => (
    <Box mb={2}>
      <Card className={classes.warnCard}>
        <CardContent>
          <Typography align="center" variant="body2" mb={2}>
            Envía{" "}
            <Typography align="center" variant="body2" fontWeight={900} component="span">
              {amount} {symbol}
            </Typography>
            <br />
            únicamente a esta dirección:
          </Typography>
          <Paper variant="outlined" className={classes.cryptoAddress}>
            <Typography p={1} align="center" variant="body2" fontWeight={900}>
              {address}
            </Typography>
          </Paper>
          <Box mt={2}>
            <Button fullWidth color="default">
              <FileCopyIcon /> Copiar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box className={classes.drawerContainer} position="relative">
      <StepsSidebar variant="primary"></StepsSidebar>
      <Container disableGutters maxWidth={false}>
        <MobileNavBar />
        <Box className={classes.topContainer}>
          <Container style={{ minHeight: "auto" }}>
            <ToolbarPadding />
            <Box mb={4}>
              <Typography variant="h5">Venta de Bitcoin</Typography>
              <Typography>
                Recibirás tu dinero en la cuenta bancaria especificada dentro de un plazo de
                24 horas.
              </Typography>
            </Box>
          </Container>
        </Box>
        <Box className={classes.mainContainer}>
          <Container style={{ minHeight: "auto" }}>
            <Grid container justify="space-between">
              <Grid item lg={4} xs={12}>
                <Hidden smUp>{getWarningBlock()}</Hidden>
                <Box mb={2}>
                  <Paper>
                    <img src={qrcodeDataURL} width="100%" height="auto" />
                  </Paper>
                </Box>
              </Grid>
              <Grid item lg={5} xs={12}>
                <Hidden smDown>{getWarningBlock()}</Hidden>
                <Typography gutterBottom>
                  IBEX Mercado estará atento a la confirmación de la transacción. Tenga en
                  cuenta que el precio de BTC se determina en la fecha y hora de la
                  transacción.
                </Typography>
                <Typography mb={4}>Mínimo de confirmaciones: 3</Typography>
                <Hidden smDown>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={onFinish}
                  >
                    Terminar
                  </Button>
                </Hidden>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Hidden smUp>
          <Box className={classes.fixedActionsContainer}>
            <Container style={{ minHeight: "auto" }}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                onClick={onFinish}
              >
                Terminar
              </Button>
            </Container>
          </Box>
        </Hidden>
      </Container>
    </Box>
  );
};

export const Confirm = withStyles((theme: Theme) => ({
  ...styles(theme),
  cryptoAddress: {
    backgroundColor: theme.palette.secondary.main,
    "& p": {
      color: theme.palette.warning.main,
    },
  },
}))(Component);
