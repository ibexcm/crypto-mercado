import {
  Backdrop as MUIBackdrop,
  BackdropProps,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { SpinnerDotted } from "spinners-react";
import { styles } from "../theme/styles";

interface Props extends WithStyles, BackdropProps {
  classes: any;
}

const Component: React.FC<Props> = ({ classes, open }) => (
  <MUIBackdrop className={classes.backdrop} open={open}>
    <SpinnerDotted color="#044900" size={70} speed={100} thickness={100} />
  </MUIBackdrop>
);

export const Backdrop = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
