import { SendPhoneNumberVerificationCodeInput } from "@ibexcm/libraries/api";
import {
  Box,
  Container,
  Divider,
  Grid,
  Hidden,
  InputAdornment,
  Paper,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import {
  Button,
  StepsSidebar,
  TextField,
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

  const onCancel = () => {
    history.push(routes.dashboard.transactions.index);
  };

  const onConfirm = () => {
    history.push(routes.dashboard.buy.confirm);
  };

  return (
    <Box className={classes.drawerContainer} position="relative">
      <StepsSidebar variant="primary"></StepsSidebar>
      <Container disableGutters>
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
              <Grid item xs={12} lg={5}>
                <Box mb={3}>
                  <Paper>
                    <TextField
                      fullWidth
                      label="¿Cuánto deseas comprar?"
                      variant="outlined"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
                      }}
                      // onChange={onChange}
                      // onKeyPress={onKeyPress}
                      // value={input.args.address}
                      type="number"
                    />
                  </Paper>
                </Box>
                <Box mb={3}>
                  <Paper>
                    <Box p={2}>
                      <Typography variant="body2" mb={2}>
                        Forma de pago
                      </Typography>
                      <Grid container justify="space-between">
                        <Grid item lg={5} xs={5}>
                          <Button fullWidth color="primary" variant="contained">
                            USD
                          </Button>
                        </Grid>
                        <Grid item lg={1} xs={1}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height={36}
                          >
                            <SwapHorizIcon />
                          </Box>
                        </Grid>
                        <Grid item lg={5} xs={5}>
                          <Button fullWidth color="primary" variant="outlined">
                            GTQ
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Box>
                <Box mb={3}>
                  <Paper>
                    <Box p={2}>
                      <Typography variant="body2" mb={3}>
                        Dirección BTC de destino
                      </Typography>
                      <Button fullWidth variant="outlined" color="primary">
                        Agregar dirección
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
              <Grid item xs={12} lg={5}>
                <Box mb={3} textAlign="right">
                  <Box mb={1}>
                    <Grid container justify="flex-end" spacing={1}>
                      <Grid item>
                        <Typography color="textSecondary">Precio actual BTC</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>USD 6254.00</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Typography variant="overline" color="primary" mb={3}>
                    Desglose
                  </Typography>
                  <Grid container justify="flex-end" spacing={1}>
                    <Grid item>
                      <Typography color="textSecondary">Cantidad</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>USD 1000.00</Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify="flex-end" spacing={1}>
                    <Grid item>
                      <Typography color="textSecondary">Comisión IBEX (3.5%)</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>USD 35.00</Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify="flex-end" spacing={1}>
                    <Grid item>
                      <Typography color="textSecondary">IVA (12%)</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>USD 12.00</Typography>
                    </Grid>
                  </Grid>
                  <Box my={1}>
                    <Divider />
                  </Box>
                  <Grid container justify="flex-end" spacing={1}>
                    <Grid item>
                      <Typography color="primary">Recibes</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography color="secondary" fontWeight={900}>
                        USD 955.00
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify="flex-end" spacing={1}>
                    <Grid item>
                      <Typography color="primary">Tasa de cambio (7.65)</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography color="secondary" fontWeight={900}>
                        GTQ 9000.00
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify="flex-end" spacing={1}>
                    <Grid item>
                      <Typography color="primary">Total a enviar</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography color="secondary" fontWeight={900}>
                        BTC 0.123456789
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box mb={3}>
                  <Typography align="justify" variant="caption">
                    Al dar click en "Confirmar", comprendo que debido a las fluctuaciones
                    del precio de Bitcoin, puedo recibir una cantidad mayor o menor a la
                    especificada en el desglose anterior.
                  </Typography>
                </Box>
                <Hidden smDown>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          color="default"
                          size="large"
                          variant="contained"
                          onClick={onCancel}
                        >
                          Cancelar
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="secondary"
                          size="large"
                          onClick={onConfirm}
                        >
                          Confirmar
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Hidden>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <Hidden smUp>
          <Box className={classes.fixedActionsContainer}>
            <Container style={{ minHeight: "auto" }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    color="default"
                    size="large"
                    variant="contained"
                    onClick={onCancel}
                  >
                    Cancelar
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={onConfirm}
                  >
                    Confirmar
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Hidden>
      </Container>
    </Box>
  );
};

export const Checkout = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
