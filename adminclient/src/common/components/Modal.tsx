import {
  Backdrop,
  Container,
  Fade,
  Modal as MUIModal,
  ModalProps,
  Paper,
  Theme,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { styles } from "../theme";

interface Props extends ModalProps {}

const Component: React.FC<Props> = ({ classes, onClose, open, children, ...props }) => {
  return (
    <MUIModal
      {...props}
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Container
          maxWidth="xs"
          style={{ minHeight: "auto", backgroundColor: "transparent" }}
        >
          <Paper>{children}</Paper>
        </Container>
      </Fade>
    </MUIModal>
  );
};

export const Modal = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
