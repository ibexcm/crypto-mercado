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
import { styles } from "../../../common/theme";
import routes from "../../../routes";

interface IMobileAppBarProps extends WithStyles {}

const Component: React.FC<IMobileAppBarProps> = ({ classes }) => {
  return (
    <Hidden smDown>
      <AppBar position="fixed" color="default" elevation={0}>
        <Container maxWidth="lg" disableGutters style={{ minHeight: "auto" }}>
          <Toolbar className={classes.toolbar}>
            <Box className={classes.logoBox}>
              <Link to={routes.root}>
                <img src="/images/ibex-icon.png" width="100%" height="auto" />
              </Link>
            </Box>
            <Box className={classes.some}>
              <Link to={routes.root} className={classes.navBarLink}>
                INICIAR SESIÓN
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
    width: 49,
    flexDirection: "column",
    justifyContent: "center",
  },
}))(Component);
