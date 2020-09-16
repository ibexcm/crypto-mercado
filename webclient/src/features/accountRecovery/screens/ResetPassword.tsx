import React from "react";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { MobileNavBar, NavBar } from "../components";
import { RouteComponentProps, StaticContext } from "react-router";
import { Box, Tab, Container, Theme, withStyles, WithStyles } from "@material-ui/core";
import {
  Button,
  InputErrorBox,
  TextField,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import {
  AccountRecoveryRepositoryInjectionKey,
  ValidationRepositoryInjectionKey,
} from "../InjectionKey";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const ValidationRepository = dependencies.provide(ValidationRepositoryInjectionKey);
  const AccountRecoveryRepository = dependencies.provide(
    AccountRecoveryRepositoryInjectionKey,
  );

  const [error, setError] = React.useState<Error | null>(null);

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
  };

  return (
    <Box className={classes.homeContainer}>
      <MobileNavBar />
      <NavBar />
      <Container maxWidth="xs">
        <Box
          minHeight="100vh"
          flexDirection="column"
          display="flex"
          justifyContent="center"
        >
          <ToolbarPadding />
          <Box mb={4}>
            <Typography variant="h5" mb={1}>
              Restablece tu Contraseña
            </Typography>
            <Typography>Elige una nueva contraseña.</Typography>
          </Box>
        </Box>
        <Box mb={4}>
          <TextField
            autoFocus
            fullWidth
            label="Contraseña"
            placeholder="Combina varios caracteres"
            variant="outlined"
            onKeyPress={onKeyPress}
            type="password"
            mb={3}
          />
          <TextField
            fullWidth
            label="Confirma tu contraseña"
            variant="outlined"
            onKeyPress={onKeyPress}
            type="password"
            mb={3}
          />
          <InputErrorBox error={error} />
          <Button color="primary" variant="contained" fullWidth size="large">
            Confirmar
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export const ResetPassword = withStyles((theme: Theme) => ({
  ...styles(theme),
  homeContainer: {
    backgroundColor: "white",
  },
}))(Component);
