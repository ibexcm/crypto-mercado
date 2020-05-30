import { AppBar, Box, Drawer, Hidden, Theme, Toolbar, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { History } from "history";
import React from "react";
import { Link } from "react-router-dom";
import routes from "../../routes";
import { styles } from "../theme";
import { Typography } from "./Typography";

export const drawerWidth = 175;
export const drawerWidthMD = 280;

interface Props extends WithStyles {
  history?: History;
  footer?: any;
}

const Component: React.FC<Props> = ({ classes, history, footer }) => {
  const isSelected = (route: string): boolean => {
    const regexp = new RegExp(route, "gi");
    return regexp.test(history.location.pathname);
  };

  return (
    <Hidden mdDown>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Box className={classes.drawerNavigation}>
          <AppBar position="absolute" elevation={0} color="transparent">
            <Toolbar>
              <Box className={classes.logoBox}>
                <Link to={routes.root}>
                  <img src="/svg/ibex-icon-white.svg" width="100%" height="auto" />
                </Link>
              </Box>
            </Toolbar>
          </AppBar>
          <Box px={3}>
            <Box mb={2}>
              <Link
                to={routes.kyc.approval}
                className={
                  isSelected(routes.kyc.approval)
                    ? `${classes.sidebarNavigationSelectedLink} ${classes.sidebarNavigationLink}`
                    : classes.sidebarNavigationLink
                }
              >
                <Typography variant="body1">KYC</Typography>
              </Link>
            </Box>
            <Box mb={2}>
              <Link
                to={routes.transaction.fiatToCryptoTransactions}
                className={
                  isSelected(routes.transaction.fiatToCryptoTransactions)
                    ? `${classes.sidebarNavigationSelectedLink} ${classes.sidebarNavigationLink}`
                    : classes.sidebarNavigationLink
                }
              >
                <Typography variant="body1">Compra</Typography>
              </Link>
            </Box>
            <Box mb={2}>
              <Link
                to={routes.transaction.cryptoToFiatTransactions}
                className={
                  isSelected(routes.transaction.cryptoToFiatTransactions)
                    ? `${classes.sidebarNavigationSelectedLink} ${classes.sidebarNavigationLink}`
                    : classes.sidebarNavigationLink
                }
              >
                <Typography variant="body1">Venta</Typography>
              </Link>
            </Box>
          </Box>
          {/* {footer && footer} */}
          <Box></Box>
        </Box>
      </Drawer>
    </Hidden>
  );
};

export const Sidebar = withStyles((theme: Theme) => ({
  ...styles(theme),
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.down("md")]: {
      width: drawerWidthMD,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
    "& svg": {
      color: "white",
    },
    [theme.breakpoints.down("md")]: {
      width: drawerWidthMD,
    },
  },
  drawerNavigation: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
  },
  logoBox: {
    minHeight: 98,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: 63,
  },
}))(Component);
