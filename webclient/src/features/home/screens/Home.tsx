import { SendPhoneNumberVerificationCodeInput } from "@ibexcm/libraries/api";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Hidden,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import { Button, ToolbarPadding, Typography } from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import routes from "../../../routes";
import { OnboardingRepositoryInjectionKeys } from "../../onboarding/InjectionKeys";
import { Footer, MobileNavBar, NavBar } from "../components";
import { ReactComponent as ScrollDownIcon } from "../components/scroll-down-icon.svg";

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const OnboardingRepository = dependencies.provide(OnboardingRepositoryInjectionKeys);

  React.useEffect(() => {
    (() => {
      const script = document.createElement("script");
      script.src =
        "https://static.zdassets.com/ekr/snippet.js?key=52b88740-ebcc-4f1c-81e1-4fd827f40adf";
      script.id = "ze-snippet";
      script.onload = () => {
        const zendesk = (window as any)?.zE;
        if (!Boolean(zendesk?.setLocale)) {
          return;
        }

        zendesk.setLocale("es");
      };

      document.querySelector("body").appendChild(script);
    })();
  }, []);

  const onCreateAccount = () => {
    OnboardingRepository.reset();
    history.push(routes.onboarding.sendPhoneNumberVerificationCode);
  };

  const onContactSupport = () => {
    if (Boolean((window as any)?.zE)) {
      (window as any).zE.setLocale("es");
      (window as any).zE.activate();
    }
  };

  return (
    <Box>
      <Box className={classes.homeContainer}>
        <Container maxWidth="lg" className={classes.introContainer}>
          <MobileNavBar />
          <NavBar />
          <Box
            minHeight="100vh"
            flexDirection="column"
            display="flex"
            justifyContent="center"
          >
            <Hidden smUp>
              <ToolbarPadding />
            </Hidden>
            <Box className={classes.introHeader} mb={3}>
              <Typography variant="h1">
                ACTIVOS DIGITALES <Typography component="span">EN QUETZALES</Typography>
              </Typography>
            </Box>
            <Container maxWidth="md" style={{ minHeight: "auto" }}>
              <Box className={classes.introText}>
                <Typography variant="h2" mb={3}>
                  IBEX Mercado es una empresa reconocida en Guatemala por la calidad y
                  rapidez de su servicio de intercambio de activos digitales y activos FIAT.
                </Typography>
                <Typography variant="h2">
                  Obtén las mejores tasas del país
                  <br />
                  sin custodia de tus llaves privadas.
                </Typography>
              </Box>
            </Container>
            <Hidden only={["xs", "sm", "lg", "md", "xl"]}>
              <Box>
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
              </Box>
            </Hidden>
          </Box>
        </Container>
        <Hidden mdDown>
          <Box py={3} className={classes.scrollDownIcon}>
            <ScrollDownIcon />
          </Box>
        </Hidden>
      </Box>
      <Box className={classes.featuresSectionBox} py={5}>
        <Container style={{ minHeight: "auto" }} maxWidth="md">
          <Box mb={4}>
            <Grid container spacing={2} justify="space-between">
              <Grid item lg={5} xs={12}>
                <Card>
                  <CardContent className={classes.cardContent}>
                    <Typography variant="h5">
                      La mejor tarifa
                      <br />
                      del mercado guatemalteco
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={5} xs={12}>
                <Card>
                  <CardContent className={classes.cardContent}>
                    <Typography variant="h5">
                      Transferencias directas a tu wallet / cuenta bancaria en menos de 24
                      hrs
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid container spacing={2} justify="space-between">
              <Grid item lg={5} xs={12}>
                <Card>
                  <CardContent className={classes.cardContent}>
                    <Typography variant="h5">
                      Deposita / transfiere tus Q's o USD's a nuestras cuentas en el BAC
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={5} xs={12}>
                <Card>
                  <CardContent className={classes.cardContent}>
                    <Typography variant="h5">
                      Contacta a nuestro
                      <br />
                      OTC-Desk aquí
                    </Typography>
                  </CardContent>
                  <CardActions style={{ justifyContent: "flex-end" }}>
                    <Button onClick={onContactSupport} variant="contained" color="primary">
                      OTC Desk
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export const Home = withStyles((theme: Theme) => ({
  ...styles(theme),
  homeContainer: {
    backgroundColor: theme.palette.primary.main,
    position: "relative",
  },
  featuresSectionBox: {
    backgroundColor: theme.palette.grey[100],
    minHeight: "50vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  cardContent: {
    minHeight: 180,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "& h5": {
      fontWeight: theme.typography.body1.fontWeight,
    },
  },
  introContainer: {},
  scrollDownIcon: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    bottom: 0,
  },
  introHeader: {
    textAlign: "center",
    color: "white",
    "& h1": {
      fontSize: theme.typography.h4.fontSize,
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.h4.fontSize,
      },
    },
    "& span": {
      display: "block",
      fontSize: theme.typography.h4.fontSize,
      fontWeight: 900,
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.h2.fontSize,
      },
    },
  },
  introText: {
    textAlign: "center",
    color: "white",
    "& h2": {
      fontSize: theme.typography.h6.fontSize,
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
  },
  listItem: {
    color: "white",
    "& svg": {
      color: "white",
    },
    "& p": {
      fontSize: theme.typography.h6.fontSize,
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.h5.fontSize,
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
