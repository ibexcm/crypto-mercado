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
import { generatePath, RouteComponentProps, StaticContext } from "react-router";
import {
  Backdrop,
  Button,
  StepsSidebar,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { Transaction } from "../../../libraries/api";
import routes from "../../../routes";
import { UserRepositoryInjectionKeys } from "../../user/InjectionKeys";
import { MobileNavBar, TransactionItem } from "../components";

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const UserRepository = dependencies.provide(UserRepositoryInjectionKeys);

  const { data, loading, error } = UserRepository.useUserQuery();

  if (loading) {
    return <Backdrop open={loading} />;
  }

  const onSellBitcoin = () => {
    history.push(routes.dashboard.sell.checkout);
  };

  const onBuyBitcoin = () => {
    history.push(routes.dashboard.buy.checkout);
  };

  const onClickTransactionItem = (transaction: Transaction) => {
    history.push(
      generatePath(routes.dashboard.transactions.details, { id: transaction.id }),
    );
  };

  const { transactions } = data.user;

  return (
    <Box className={classes.drawerContainer} position="relative">
      <StepsSidebar variant="primary"></StepsSidebar>
      <Container disableGutters>
        <MobileNavBar />
        <Box className={classes.topContainer}>
          <Container style={{ minHeight: "auto" }}>
            <ToolbarPadding />
            <Box mb={4}>
              <Grid container spacing={2}>
                <Grid item lg={6}>
                  <Typography variant="h5">Transacciones</Typography>
                  <Typography>Histórico de compra/venta de BTC</Typography>
                </Grid>
                <Hidden mdDown>
                  <Grid item lg={6}>
                    <Box>
                      <Grid container spacing={2} justify="flex-end">
                        <Grid item>
                          <Button
                            fullWidth
                            color="default"
                            size="large"
                            variant="contained"
                            onClick={onSellBitcoin}
                          >
                            Vender BTC
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={onBuyBitcoin}
                          >
                            Comprar BTC
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Hidden>
              </Grid>
            </Box>
          </Container>
        </Box>
        <Box className={classes.mainContainer}>
          <Container style={{ minHeight: "auto" }}>
            {transactions.map((transaction: Transaction) => (
              <TransactionItem
                transaction={transaction}
                onClickTransactionItem={onClickTransactionItem}
                key={transaction.id}
              />
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
                    Vender BTC
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
                    Comprar BTC
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
