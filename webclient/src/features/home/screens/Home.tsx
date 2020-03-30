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
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import { Button, ToolbarPadding, Typography } from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import routes from "../../../routes";
import { OnboardingRepositoryInjectionKeys } from "../../onboarding/InjectionKeys";
import { MobileNavBar, NavBar } from "../components";

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const OnboardingRepository = dependencies.provide(OnboardingRepositoryInjectionKeys);

  const onCreateAccount = () => {
    OnboardingRepository.reset();
    history.push(routes.onboarding.sendPhoneNumberVerificationCode);
  };

  return (
    <Box className={classes.homeContainer}>
      <Container maxWidth="lg">
        <MobileNavBar />
        <NavBar />
        <Box
          minHeight="100vh"
          flexDirection="column"
          display="flex"
          justifyContent="center"
        >
          <ToolbarPadding />
          <Grid container>
            <Grid item lg={7}>
              <Box className={classes.introText}>
                <Typography variant="h5" fontWeight={500}>
                  Respaldamos tu Esfuerzo.
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  color="textSecondary"
                  className={classes.currencyPairText}
                >
                  Compra y Vende Bitcoin en Guatemala
                </Typography>
              </Box>
              <Box mb={6} mt={3}>
                <Grid container spacing={1} wrap="nowrap">
                  <Grid item>
                    <CheckCircleOutlineIcon fontSize="small" color="primary" />
                  </Grid>
                  <Grid item>
                    <Typography fontWeight={500} gutterBottom>
                      Sin custodia de tus llaves privadas
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={1} wrap="nowrap">
                  <Grid item>
                    <CheckCircleOutlineIcon fontSize="small" color="primary" />
                  </Grid>
                  <Grid item>
                    <Typography fontWeight={500} gutterBottom>
                      Compra BTC desde Q.1000,00
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={1} wrap="nowrap">
                  <Grid item>
                    <CheckCircleOutlineIcon fontSize="small" color="primary" />
                  </Grid>
                  <Grid item>
                    <Typography fontWeight={500}>
                      Depósito a tu cuenta bancaria en menos de 24 horas
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={1} wrap="nowrap">
                  <Grid item>
                    <CheckCircleOutlineIcon fontSize="small" color="primary" />
                  </Grid>
                  <Grid item>
                    <Typography fontWeight={500}>
                      Hasta US$10,000.00 de límite de retiro mensual. <sup>[1]</sup>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={1} wrap="nowrap">
                  <Grid item>
                    <CheckCircleOutlineIcon fontSize="small" color="primary" />
                  </Grid>
                  <Grid item>
                    <Typography fontWeight={500} gutterBottom>
                      Hasta 1.5% TRM
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Hidden only={["xs", "sm", "lg", "md", "xl"]}>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={onCreateAccount}
                  className={classes.ctaButton}
                >
                  Crea una cuenta
                </Button>
              </Hidden>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export const Home = withStyles((theme: Theme) => ({
  ...styles(theme),
  homeContainer: {
    backgroundColor: "white",
  },
  introText: {
    "& h5": {
      fontWeight: 900,
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.h3.fontSize,
        fontWeight: 900,
      },
    },
  },
  ctaButton: {
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },
  currencyPairText: {
    fontWeight: 500,
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.body1.fontSize,
    },
  },
  currencyPairsRow: {
    "& svg": {
      fontSize: theme.typography.h5.fontSize,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "32px",
      [theme.breakpoints.down("sm")]: {
        fontSize: theme.typography.body1.fontSize,
        height: "22px",
      },
    },
  },
}))(Component);
