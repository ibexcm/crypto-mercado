import {
  AuthenticateInput,
  MutationAuthenticateArgs,
  SendPhoneNumberVerificationCodeInput,
} from "@ibexcm/libraries/api";
import {
  Box,
  Card,
  CardContent,
  Container,
  Link,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import {
  Button,
  InputErrorBox,
  TextField,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import routes from "../../../routes";
import { MobileNavBar, NavBar } from "../components";
import { AuthenticationRepositoryInjectionKeys } from "../InjectionKeys";

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const AuthenticationRepository = dependencies.provide(
    AuthenticationRepositoryInjectionKeys,
  );

  const [error, setError] = React.useState<Error | null>(null);
  const [input, setInput] = React.useState<MutationAuthenticateArgs>({
    args: {
      address: "",
      password: "",
    },
  });

  const {
    execute: executeUseAuthenticateMutation,
  } = AuthenticationRepository.useAuthenticateMutation();

  const onAuthenticate = async () => {
    setError(null);
    try {
      await executeUseAuthenticateMutation(input);
      history.push(routes.dashboard.transactions.index);
    } catch (error) {
      setError(error);
    }
  };

  const onSetAuthenticateInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: keyof AuthenticateInput,
  ) => {
    const value = event.target.value;
    setInput((prev) => {
      input.args[key] = value;
      return {
        ...prev,
        ...input,
      };
    });
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onAuthenticate();
    }
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
            <Typography variant="h5" gutterBottom>
              Bienvenido
            </Typography>
            <Card className={classes.warnCard}>
              <CardContent>
                <Typography align="center" variant="body2">
                  Asegúrate de estar visitando <strong>https://ibexmercado.com</strong> en
                  la barra de tu navegador.
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box>
            <TextField
              autoFocus
              fullWidth
              label="Correo electrónico"
              variant="outlined"
              type="email"
              mb={3}
              value={input.args.address}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onSetAuthenticateInput(event, "address");
              }}
              onKeyPress={onKeyPress}
            />
            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              type="password"
              mb={3}
              value={input.args.password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onSetAuthenticateInput(event, "password");
              }}
              onKeyPress={onKeyPress}
            />
            <InputErrorBox error={error} />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              size="large"
              onClick={onAuthenticate}
              disabled={!Boolean(input.args.address) || !Boolean(input.args.password)}
            >
              INICIAR SESIÓN
            </Button>
            <Box my={2}>
              <Link href={routes.recovery.requestAccountRecoveryLink}>
                <Typography align="center">¿Olvidaste tu contraseña?</Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export const Authenticate = withStyles((theme: Theme) => ({
  ...styles(theme),
  homeContainer: {
    backgroundColor: "white",
  },
}))(Component);
