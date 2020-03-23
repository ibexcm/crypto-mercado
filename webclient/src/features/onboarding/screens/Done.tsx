import { Box, Container, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { RouteComponentProps } from "react-router";
import {
  Button,
  StepsSidebar,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import { styles } from "../../../common/theme";
import routes from "../../../routes";
import { MobileAppBar } from "../components";

interface Props extends WithStyles, RouteComponentProps {}

const Component: React.FC<Props> = ({ classes, history, match, ...props }) => {
  return (
    <Box className={classes.drawerContainer}>
      <StepsSidebar />
      <Container maxWidth="xs">
        <MobileAppBar />
        <ToolbarPadding />
        <Box
          mb={4}
          textAlign="center"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          minHeight="85vh"
        >
          <Typography variant="h5" mb={1}>
            ¡Todo listo!
          </Typography>
          <Typography gutterBottom>
            Revisaremos tu documentación y te notificaremos en caso de aprobación.
          </Typography>
          <Typography mb={4}>
            Una vez aprobada, podrás realizar transacciones en la plataforma hasta por
            US$10,000.00 al mes.
          </Typography>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            size="large"
            onClick={() => {
              history.push(routes.root);
            }}
          >
            Terminar
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export const Done = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
