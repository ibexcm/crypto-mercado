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
import { MobileNavBar, TransactionItem } from "../components";
import { TransactionRepositoryInjectionKeys } from "../InjectionKeys";

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const TransactionRepository = dependencies.provide(TransactionRepositoryInjectionKeys);

  return (
    <Box className={classes.container} position="relative">
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
        <Box className={classes.transactionsContainer}>
          <Container style={{ minHeight: "auto" }}>
            {Array(30)
              .fill(null)
              .map(() => (
                <TransactionItem />
              ))}
          </Container>
        </Box>
        <Hidden smUp>
          <Box
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            width="100%"
            py={2}
            className={classes.buyOrSellButtons}
          >
            <Container style={{ minHeight: "auto" }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button fullWidth color="default" size="large" variant="contained">
                    Comprar BTC
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth variant="contained" color="secondary" size="large">
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
  container: {
    ...styles(theme).drawerContainer,
    backgroundColor: "white",
  },
  buyOrSellButtons: {
    backgroundColor: theme.palette.primary.main,
    "& > div": {
      minHeight: "auto",
    },
  },
  topContainer: {
    height: "30vh",
    [theme.breakpoints.down("sm")]: {
      height: "20vh",
    },
  },
  transactionsContainer: {
    height: "70vh",
    [theme.breakpoints.down("sm")]: {
      height: "80vh",
    },
    backgroundColor: "whitesmoke",
    overflowY: "scroll",
    paddingTop: theme.spacing(3),
    paddingBottom: 98,
  },
}))(Component);
