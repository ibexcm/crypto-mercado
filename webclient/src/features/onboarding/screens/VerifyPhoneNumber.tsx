import {
  MutationVerifyPhoneNumberArgs,
  SendPhoneNumberVerificationCodeInput,
} from "@ibexcm/libraries/api";
import { Box, Container, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
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
import { MobileAppBar } from "../components";
import { OnboardingRepositoryInjectionKeys } from "../InjectionKeys";

interface IVerifyPhoneNumberProps
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<IVerifyPhoneNumberProps> = ({
  classes,
  history,
  location,
  match,
  ...props
}) => {
  const dependencies = React.useContext(DependencyContext);
  const OnboardingRepository = dependencies.provide(OnboardingRepositoryInjectionKeys);
  const [error, setError] = React.useState<Error | null>(null);
  const [input, setInput] = React.useState<MutationVerifyPhoneNumberArgs>({
    args: {
      number: location.state.number,
      code: "",
    },
  });

  const {
    execute: executeVerifyPhoneNumberMutation,
  } = OnboardingRepository.useVerifyPhoneNumberMutation();

  const onVerifyPhoneNumber = async () => {
    setError(null);
    try {
      await executeVerifyPhoneNumberMutation(input);
      history.push(routes.onboarding.sendEmailVerificationCode);
    } catch (error) {
      setError(error);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput({ ...input, args: { code: value.toString(), number: input.args.number } });
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onVerifyPhoneNumber();
    }
  };

  return (
    <Box className={classes.drawerContainer}>
      <StepsSidebar />
      <Container maxWidth="xs">
        <MobileAppBar />
        <ToolbarPadding />
        <Box mb={4}>
          <Typography variant="h5" mb={1}>
            Verifica tu teléfono
          </Typography>
          <Typography>
            Ingresa el código de 6 dígitos que enviamos por SMS al {input.args.number}.
          </Typography>
        </Box>
        <Box mb={4}>
          <TextField
            autoFocus
            fullWidth
            label="Código"
            variant="outlined"
            onChange={onChange}
            onKeyPress={onKeyPress}
            value={input.args.code}
            type="number"
            mb={3}
          />
          <InputErrorBox error={error} />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            size="large"
            onClick={onVerifyPhoneNumber}
          >
            Verificar
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export const VerifyPhoneNumber = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
