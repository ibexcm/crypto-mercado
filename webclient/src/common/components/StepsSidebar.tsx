import { AppBar, Box, Drawer, Hidden, Theme, Toolbar, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { History } from "history";
import React from "react";
import { Link } from "react-router-dom";
import routes from "../../routes";
import { toolbarHeightDesktop } from "../theme";

export const drawerWidth = 350;
export const drawerWidthMD = 280;

interface IStepsSidebarProps extends WithStyles {
  history?: History;
  footer?: any;
  variant?: "primary" | "default";
}

const Component: React.FC<IStepsSidebarProps> = ({
  classes,
  children,
  variant,
  footer,
}) => (
  <Hidden mdDown>
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: variant === "primary" ? classes.drawerPaperPrimary : classes.drawerPaper,
      }}
    >
      <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
        <AppBar
          position="absolute"
          elevation={0}
          color="inherit"
          className={classes.appBarPaper}
        >
          <Toolbar>
            <Box className={classes.logoBox}>
              <Link to={routes.root}>
                {variant === "primary" ? (
                  <img src="/svg/ibex-logo-white.svg" width="100%" height="auto" />
                ) : (
                  <img src="/svg/ibex-logo.svg" width="100%" height="auto" />
                )}
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
        {children}
        {/* {footer && footer} */}
        <Box></Box>
      </Box>
    </Drawer>
  </Hidden>
);

export const StepsSidebar = withStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.down("md")]: {
      width: drawerWidthMD,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "white",
    "& svg": {
      color: theme.palette.primary.main,
    },
    [theme.breakpoints.down("md")]: {
      width: drawerWidthMD,
    },
  },
  drawerPaperPrimary: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
    "& svg": {
      color: "white",
    },
    [theme.breakpoints.down("md")]: {
      width: drawerWidthMD,
    },
  },
  logoBox: {
    minHeight: toolbarHeightDesktop,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: 161,
  },
  appBarPaper: {
    backgroundColor: "transparent",
  },
}))(Component);
