import {
  AppBar,
  Box,
  Container,
  Hidden,
  Theme,
  Toolbar,
  WithStyles,
} from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Link } from "react-router-dom";
import { styles } from "../../../common/theme";
import routes from "../../../routes";

interface IMobileAppBarProps extends WithStyles {}

const Component: React.FC<IMobileAppBarProps> = ({ classes }) => {
  return (
    <Hidden smDown>
      <AppBar position="absolute" color="default" elevation={0}>
        <Container maxWidth="lg" disableGutters style={{ minHeight: "auto" }}>
          <Toolbar className={classes.toolbar}>
            <Box className={classes.logoBox}>
              <Link to={routes.dashboard.transactions.index} className={classes.navBarLink}>
                <Box display="flex" flexDirection="column" justifyContent="center">
                  <ChevronLeft />
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center">
                  TRANSACCIONES
                </Box>
              </Link>
            </Box>
            <Box className={classes.some}>
              <Hidden only={["xs", "sm", "lg", "md", "xl"]}>
                <Link to={routes.root} className={classes.navBarLink}>
                  INICIAR SESIÓN
                </Link>
              </Hidden>
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
    width: 161,
    flexDirection: "column",
    justifyContent: "center",
  },
}))(Component);
