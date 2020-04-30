import { SendPhoneNumberVerificationCodeInput } from "@ibexcm/libraries/api";
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
import { RouteComponentProps, StaticContext } from "react-router";
import {
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

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKeys);

  const [qrcodeDataURL, setQRCodeDataURL] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const url = await QRCode.toDataURL(
          "bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W?amount=20.3",
          { margin: 1, quality: 1 },
        );
        setQRCodeDataURL(url);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const onEnd = () => {
    history.push(routes.dashboard.transactions.index);
  };

  const getWarningBlock = () => (
    <Box mb={2}>
      <Card className={classes.warnCard}>
        <CardContent>
          <Typography align="center" variant="body2" mb={2}>
            Envía{" "}
            <Typography align="center" variant="body2" fontWeight={900} component="span">
              0.123456 BTC
            </Typography>
            <br />
            únicamente a esta dirección:
          </Typography>
          <Paper variant="outlined" className={classes.cryptoAddress}>
            <Typography p={1} align="center" variant="body2" fontWeight={900}>
              3FvbouBfdexEsLJJGZc1Pn6VeizfmDwozC
            </Typography>
          </Paper>
          <Box mt={2}>
            <Button fullWidth color="default" onClick={onEnd}>
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
              <Typography variant="h5">Compra de Bitcoin</Typography>
              <Typography>
                Recibirás tu BTC en la dirección especificada una vez que confirmemos el
                depósito.
              </Typography>
            </Box>
          </Container>
        </Box>
        <Box className={classes.mainContainer}>
          <Container style={{ minHeight: "auto" }}>
            <Grid container justify="space-between">
              <Grid item lg={4} xs={12}>
                <Box mb={3}>
                  <Paper>
                    <Box p={2}>
                      <Typography variant="body2" mb={3}>
                        Su número de cliente:
                      </Typography>
                      <Box>
                        <Typography variant="h6" mb={2}>
                          AB123456
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
                        <Typography variant="h6">0123456789</Typography>
                        <Typography>IBEX Mercado SA</Typography>
                        <Typography>Monetaria, USD</Typography>
                        <Typography color="textSecondary">
                          Banco del Crédito SA de Guatemala, BAC
                        </Typography>
                      </Box>
                    </Box>
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
                <Hidden smDown>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={onEnd}
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
                onClick={onEnd}
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
