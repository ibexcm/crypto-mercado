import { Box, Theme, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { styles } from "../../../common/theme";

export const drawerWidth = 420;

interface ISidebarNavigationProps extends WithStyles, RouteComponentProps<{ id: string }> {}

const Component: React.FC<ISidebarNavigationProps> = ({ classes, history, match }) => {
  const isSelected = (route: string): boolean => {
    const regexp = new RegExp(route, "gi");
    return regexp.test(history.location.pathname);
  };

  return <Box px={3}></Box>;
};

export const SidebarNavigation = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
