import { SendPhoneNumberVerificationCodeInput } from "@ibexcm/libraries/api";
import {
  Box,
  Container,
  Grid,
  Hidden,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import {
  Button,
  StepsSidebar,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import routes from "../../../routes";
import { MobileNavBar, TransactionItem } from "../components";
import { TransactionRepositoryInjectionKeys } from "../InjectionKeys";

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKeys);

  const onSellBitcoin = () => {
    history.push(routes.dashboard.bitcoin.sell);
  };

  const onBuyBitcoin = () => {
    history.push(routes.dashboard.bitcoin.buy);
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
              <Typography variant="h5">Transacciones</Typography>
              <Typography>Histórico de compra/venta de BTC</Typography>
            </Box>
          </Container>
        </Box>
        <Box className={classes.mainContainer}>
          <Container style={{ minHeight: "auto" }}>
            {Array(30)
              .fill(null)
              .map(() => (
                <TransactionItem />
              ))}
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
                    onClick={onSellBitcoin}
                  >
                    Comprar BTC
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={onBuyBitcoin}
                  >
                    Vender BTC
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

export const TransactionsIndex = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
