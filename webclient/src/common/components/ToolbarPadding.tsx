import { Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { toolbarHeightDesktop, toolbarHeightMobile } from "../theme";

export const ToolbarPadding = withStyles((theme: Theme) => ({
  toolbarPadding: {
    minHeight: toolbarHeightDesktop,
    marginBottom: toolbarHeightDesktop / 2,
    [theme.breakpoints.down("sm")]: {
      minHeight: toolbarHeightMobile,
      marginBottom: toolbarHeightMobile / 2,
    },
  },
}))(({ classes }: { classes: any }) => <div className={classes.toolbarPadding} />);
