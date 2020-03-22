import { MutationSetPasswordArgs } from "@ibexcm/libraries/api";
import { Box, Container, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { RouteComponentProps } from "react-router";
import {
  Button,
  InputErrorBox,
  StepsSidebar,
  TextField,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import routes from "../../../routes";
import { MobileAppBar, SidebarNavigation } from "../components";
import { OnboardingRepositoryInjectionKeys } from "../InjectionKeys";

interface Props extends WithStyles, RouteComponentProps {}

const Component: React.FC<Props> = ({ classes, history, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const OnboardingRepository = dependencies.provide(OnboardingRepositoryInjectionKeys);
  const [error, setError] = React.useState<Error | null>(null);
  const [input, setInput] = React.useState<MutationSetPasswordArgs>({
    args: {
      password: "",
    },
  });
  const [confirmPasswordInput, setConfirmPasswordInput] = React.useState<
    MutationSetPasswordArgs
  >({
    args: {
      password: "",
    },
  });

  const {
    execute: executeSetPasswordMutation,
  } = OnboardingRepository.useSetPasswordMutation();

  const onSetPassword = async () => {
    if (confirmPasswordInput.args.password !== input.args.password) {
      setError(new Error("La contraseñas no coinciden."));
      return;
    }

    try {
      await executeSetPasswordMutation(input);
      history.push(routes.onboarding.uploadGovernmentID);
    } catch (error) {
      setError(error);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput({ ...input, args: { password: value } });
  };

  const onConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConfirmPasswordInput({ ...confirmPasswordInput, args: { password: value } });
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSetPassword();
    }
  };

  return (
    <Box className={classes.drawerContainer}>
      <StepsSidebar>
        <SidebarNavigation history={history} {...props} />
      </StepsSidebar>
      <Container maxWidth="xs">
        <MobileAppBar />
        <ToolbarPadding />
        <Box mb={4}>
          <Typography variant="h5" mb={1}>
            Elige una contraseña
          </Typography>
          <Typography>
            Aunque no guardamos tus llaves privadas, es importante que tu contraseña sea
            segura.
          </Typography>
        </Box>
        <Box mb={4}>
          <TextField
            autoFocus
            fullWidth
            label="Contraseña"
            placeholder="Combina varios caracteres"
            variant="outlined"
            onChange={onChange}
            onKeyPress={onKeyPress}
            value={input.args.password}
            type="password"
            mb={3}
          />
          <TextField
            fullWidth
            label="Confirma tu contraseña"
            variant="outlined"
            onChange={onConfirmPasswordChange}
            onKeyPress={onKeyPress}
            value={confirmPasswordInput.args.password}
            type="password"
            mb={3}
          />
          <InputErrorBox error={error} />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            size="large"
            onClick={onSetPassword}
          >
            Continuar
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export const SetPassword = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
