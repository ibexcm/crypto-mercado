import { AppBar, Box, Hidden, Theme, Toolbar, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Link } from "react-router-dom";
import { styles } from "../../../common/theme";
import routes from "../../../routes";

interface IMobileAppBarProps extends WithStyles {}

const Component: React.FC<IMobileAppBarProps> = ({ classes }) => {
  return (
    <Hidden smUp>
      <AppBar position="fixed" color="default">
        <Toolbar className={classes.toolbar}>
          <Box className={classes.logoBox}>
            <Link to={routes.dashboard.transactions.index}>
              <img src="/svg/ibex-icon.svg" width="100%" height="auto" />
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
      </AppBar>
    </Hidden>
  );
};

export const MobileNavBar = withStyles((theme: Theme) => ({
  ...styles(theme),
  logoBox: {
    width: 49,
    flexDirection: "column",
    justifyContent: "center",
  },
}))(Component);
