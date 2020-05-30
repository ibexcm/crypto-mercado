import { Box, Container, Grid, Theme, Typography, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Link } from "react-router-dom";
import { logoWidthDesktop, styles } from "../../../common/theme";
import routes from "../../../routes";

interface IMobileAppBarProps extends WithStyles {}

const Component: React.FC<IMobileAppBarProps> = ({ classes }) => {
  return (
    <Box className={classes.footerContainer} py={2}>
      <Container maxWidth="lg" style={{ minHeight: "auto" }}>
        <Grid container spacing={2}>
          <Grid item lg={3} xs={12}>
            <Box className={`${classes.logoBox} ${classes.footerBox}`}>
              <Link to={routes.root}>
                <img src="/svg/ibex-logo.svg" width="100%" height="auto" />
              </Link>
            </Box>
          </Grid>
          <Grid item lg={9} xs={12}>
            <Box className={`${classes.footerBox} ${classes.contact}`}>
              <Typography>E-Mercado GT, S.A.</Typography>
              <Typography>
                6 Av 20-25 zona 10
                <br />
                Edificio Maritima Oficina 7-3
              </Typography>
              <a
                href="https://api.whatsapp.com/send?phone=50245118238"
                target="_blank"
                rel="nofollow"
              >
                <Typography>+502 4511 82 38</Typography>
              </a>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export const Footer = withStyles((theme: Theme) => ({
  ...styles(theme),
  footerContainer: {
    backgroundColor: theme.palette.grey[100],
  },
  contact: {
    textAlign: "right",
    "& p": {
      [theme.breakpoints.down("md")]: {
        textAlign: "center",
      },
    },
  },
  footerBox: {
    justifyContent: "center",
    flexDirection: "column",
    minHeight: "15vh",
    display: "flex",
    [theme.breakpoints.down("md")]: {
      minHeight: "10vh",
    },
  },
  logoBox: {
    "& a": {
      width: logoWidthDesktop,
    },
    [theme.breakpoints.down("md")]: {
      alignItems: "center",
      flexDirection: "row",
    },
  },
}))(Component);
