import { AppBar, Box, Drawer, Hidden, Theme, Toolbar, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { History } from "history";
import React from "react";
import { Link } from "react-router-dom";
import routes from "../../routes";

export const drawerWidth = 350;
export const drawerWidthMD = 280;

interface IStepsSidebarProps extends WithStyles {
  history?: History;
  footer?: any;
}

const Component: React.FC<IStepsSidebarProps> = ({ classes, children, footer }) => (
  <Hidden mdDown>
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
        <AppBar position="absolute" elevation={0} color="inherit">
          <Toolbar>
            <Box className={classes.logoBox}>
              <Link to={routes.root}>
                <img src="/images/ibex-icon.png" width="100%" height="auto" />
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
  logoBox: {
    minHeight: 98,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: 63,
  },
}))(Component);
