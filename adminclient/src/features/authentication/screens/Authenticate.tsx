import {
  MutationAdminAuthenticateArgs,
  SendPhoneNumberVerificationCodeInput,
} from "@ibexcm/libraries/api";
import { Box, Container, Grid, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import {
  Button,
  InputErrorBox,
  TextField,
  ToolbarPadding,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import routes from "../../../routes";
import { NavBar } from "../components";
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
  const [input, setInput] = React.useState<MutationAdminAuthenticateArgs>({
    args: {
      address: "",
      password: "",
    },
  });

  const {
    execute: executeAdminAuthenticateMutation,
  } = AuthenticationRepository.useAdminAuthenticateMutation();

  const onAdminAuthenticate = async () => {
    setError(null);
    try {
      await executeAdminAuthenticateMutation(input);
      history.push(routes.kyc.approval);
    } catch (error) {
      setError(error);
    }
  };

  const onChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const address = event.target.value;
    setInput({ args: { ...input.args, address } });
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setInput({ args: { ...input.args, password } });
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onAdminAuthenticate();
    }
  };

  return (
    <Box>
      <Container maxWidth={false}>
        <NavBar />
        <Box
          minHeight="100vh"
          flexDirection="column"
          display="flex"
          justifyContent="center"
        >
          <ToolbarPadding />
          <Grid container justify="center">
            <Grid item lg={4}>
              <Box mb={4}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Correo electrónico"
                  variant="outlined"
                  onChange={onChangeAddress}
                  onKeyPress={onKeyPress}
                  value={input.args.address}
                  type="email"
                  mb={3}
                />
                <TextField
                  fullWidth
                  label="Contraseña"
                  variant="outlined"
                  onChange={onChangePassword}
                  onKeyPress={onKeyPress}
                  value={input.args.password}
                  type="password"
                  mb={3}
                />
                <InputErrorBox error={error} />
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={onAdminAuthenticate}
                >
                  Iniciar Sesión
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export const Authenticate = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
