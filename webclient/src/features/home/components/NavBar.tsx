import {
  AppBar,
  Box,
  Container,
  Hidden,
  Theme,
  Toolbar,
  WithStyles,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Link } from "react-router-dom";
import { logoWidthDesktop, styles } from "../../../common/theme";
import routes from "../../../routes";

interface IMobileAppBarProps extends WithStyles {}

const Component: React.FC<IMobileAppBarProps> = ({ classes }) => {
  return (
    <Hidden smDown>
      <AppBar position="absolute" color="transparent" elevation={0}>
        <Container maxWidth="lg" disableGutters style={{ minHeight: "auto" }}>
          <Toolbar className={classes.toolbar}>
            <Box className={classes.logoBox}>
              <Link to={routes.root}>
                <img src="/svg/ibex-logo-no-icon-white.svg" width="100%" height="auto" />
              </Link>
            </Box>
            <Box className={classes.iconBox}>
              <Link to={routes.root}>
                <img src="/svg/ibex-icon-white.svg" width="100%" height="auto" />
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Hidden>
  );
};

export const NavBar = withStyles((theme: Theme) => ({
  ...styles(theme),
  logoBox: {
    width: logoWidthDesktop,
    flexDirection: "column",
    justifyContent: "center",
  },
  iconBox: {
    width: logoWidthDesktop * 0.55,
    flexDirection: "column",
    justifyContent: "center",
  },
}))(Component);
