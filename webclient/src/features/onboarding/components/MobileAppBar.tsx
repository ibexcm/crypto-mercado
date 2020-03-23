import { AppBar, Box, Hidden, Theme, Toolbar, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Link } from "react-router-dom";
import { styles } from "../../../common/theme";
import routes from "../../../routes";

interface IMobileAppBarProps extends WithStyles {}

const Component: React.FC<IMobileAppBarProps> = ({ classes }) => {
  return (
    <AppBar position="fixed" color="default" className={classes.mobileNavBar}>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.logoBox}>
          <Hidden smUp>
            <Link to={routes.root}>
              <img src="/images/ibex-icon.png" width="100%" height="auto" />
            </Link>
          </Hidden>
        </Box>
        <Box className={classes.some}>
          <Link to={routes.root} className={classes.navBarLink}>
            INICIAR SESIÓN
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export const MobileAppBar = withStyles((theme: Theme) => ({
  ...styles(theme),
  mobileNavBar: {
    [theme.breakpoints.up("sm")]: {
      boxShadow: "none",
    },
  },
  logoBox: {
    width: 49,
    flexDirection: "column",
    justifyContent: "center",
  },
}))(Component);
