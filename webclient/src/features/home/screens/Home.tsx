import { SendPhoneNumberVerificationCodeInput } from "@ibexcm/libraries/api";
import {
  Box,
  Container,
  Grid,
  Hidden,
  Link,
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
            minHeight="70vh"
            flexDirection="column"
            display="flex"
            justifyContent="center"
            py={7}
          >
            <Hidden smUp>
              <ToolbarPadding />
            </Hidden>
            <Box className={classes.introHeader}>
              <Typography variant="h1">
                ACTIVOS DIGITALES <Typography component="span">EN QUETZALES</Typography>
              </Typography>
            </Box>
            <Box className={classes.chevronDown} my={4}>
              <img src="/svg/chevron-down.svg" width={24} height="auto" />
            </Box>
            <Container maxWidth="md" style={{ minHeight: "auto" }}>
              <Box className={classes.introText}>
                <Typography variant="h2" mb={3}>
                  LA COMISIÓN MÁS BAJA
                </Typography>
                <Typography variant="h2">DEL MERCADO</Typography>
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
        <Box className={classes.cryptoIconsBox}>
          <Container maxWidth="md" style={{ minHeight: "auto" }}>
            <Grid container justify="center" wrap="nowrap">
              <Grid item xs={4} lg={2}>
                <Box className={classes.iconBox}>
                  <img src="/svg/bitcoin-circle.svg" width={70} height="auto" />
                </Box>
              </Grid>
              <Grid item xs={4} lg={2}>
                <Box className={classes.iconBox}>
                  <img src="/svg/ether-circle.svg" width={70} height="auto" />
                </Box>
              </Grid>
              <Grid item xs={4} lg={2}>
                <Box className={classes.iconBox}>
                  <img src="/svg/tether-circle.svg" width={70} height="auto" />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <Box className={classes.descriptionSectionBox} py={8}>
        <Container style={{ minHeight: "auto" }} maxWidth="lg">
          <Typography variant="h4" mb={4} color="primary">
            CONTAMOS CON LIQUIDEZ INMEDIATA
          </Typography>
          <Typography variant="h5" mb={3} color="primary">
            <strong>1.</strong> Deposita en Q’s ó $ en nuestra cuenta de{" "}
            <strong>BAC Credomatic</strong>
          </Typography>
          <Typography variant="h5" color="primary">
            <strong>2.</strong> Te transferimos directamente a tu wallet o cuenta bancaria
          </Typography>
        </Container>
      </Box>
      <Box className={classes.otcSectionBox} py={8}>
        <Container style={{ minHeight: "auto" }} maxWidth="lg">
          <Typography variant="h4" color="primary" align="center" mb={4}>
            Contáctanos para una atención personalizada
          </Typography>
          <Grid container justify="center" spacing={4}>
            <Grid item>
              <Typography variant="h4" color="primary" align="center">
                <strong>OTC Desk</strong>
              </Typography>
            </Grid>
            <Grid item>
              <Link href="https://wa.me/50245118238" target="_blank" rel="nofollow">
                <Button variant="contained" color="primary">
                  <img src="/svg/whatsapp-icon.svg" width={21} />
                  <Typography component="span" ml={2}>
                    45118238
                  </Typography>
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={classes.connectionSectionBox} py={8}>
        <Container style={{ minHeight: "auto" }} maxWidth="md">
          <Hidden smUp>
            <img src="/images/conexion-mobile.png" width="100%" />
          </Hidden>
          <Hidden smDown>
            <img src="/svg/conexion-divider.svg" width="100%" />
          </Hidden>
        </Container>
      </Box>
      <Box className={classes.connectionSectionBox} pt={8}>
        <Container style={{ minHeight: "auto" }} maxWidth="sm">
          <Typography variant="h5" color="primary" align="center" mb={5}>
            Aliados Estratégicos
          </Typography>
          <Grid container justify="space-between">
            <Grid item xs={12} lg="auto">
              <Box display="flex" justifyContent="center" pb={8}>
                <img src="/svg/dt-logo-grey.svg" width={280} />
              </Box>
            </Grid>
            <Grid item xs={12} lg="auto">
              <Box display="flex" justifyContent="center" pb={8}>
                <img src="/svg/itz-logo-grey.svg" width={100} />
              </Box>
            </Grid>
          </Grid>
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
  otcSectionBox: {
    backgroundColor: theme.palette.grey[100],
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
  introContainer: {
    minHeight: "auto",
  },
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
      marginTop: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.h3.fontSize,
      },
    },
  },
  chevronDown: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
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
  cryptoIconsBox: {
    position: "absolute",
    width: "100%",
    bottom: -32,
    left: 0,
    "& img": {},
  },
  iconBox: {
    display: "flex",
    justifyContent: "center",
  },
  descriptionSectionBox: {
    background: "white",
    textAlign: "center",
    "& h5": {
      fontWeight: theme.typography.body1.fontWeight,
    },
    [theme.breakpoints.down("sm")]: {
      "& h4": {
        fontSize: theme.typography.h5.fontSize,
      },
    },
  },
  connectionSectionBox: {
    background: "white",
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
