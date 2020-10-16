import {
  MutationSendEmailVerificationCodeArgs,
  MutationVerifyEmailArgs,
} from "@ibexcm/libraries/api";
import { Box, Container, Theme, withStyles, WithStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import {
  Button,
  Modal,
  StepsSidebar,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import routes from "../../../routes";
import { MobileAppBar, SidebarNavigation } from "../components";
import { OnboardingRepositoryInjectionKeys } from "../InjectionKeys";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, history, location, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const OnboardingRepository = dependencies.provide(OnboardingRepositoryInjectionKeys);
  const queryParams = new URLSearchParams(location.search);
  const [isVerifiying, setIsVerifying] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const address = queryParams.get("a") as string;
  const token = queryParams.get("t") as string;
  const [input] = React.useState<MutationVerifyEmailArgs>({
    args: {
      address,
      code: queryParams.get("c") as string,
    },
  });

  const [sendEmailVerificationCodeInput, setInput] = React.useState<
    MutationSendEmailVerificationCodeArgs
  >({
    args: {
      address,
    },
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const {
    execute: executeSendEmailVerificationCodeMutation,
  } = OnboardingRepository.useSendEmailVerificationCodeMutation();

  const onSendVerificationCode = async () => {
    try {
      await executeSendEmailVerificationCodeMutation(sendEmailVerificationCodeInput);
      setIsModalOpen(true);
    } catch (error) {}
  };

  const {
    execute: executeVerifyEmailMutation,
    setAuthToken,
  } = OnboardingRepository.useVerifyEmailMutation();

  React.useEffect(() => {
    setAuthToken(token, () => {
      onVerifyEmail();
    });
  }, []);

  const onVerifyEmail = async () => {
    setError(null);
    setIsVerifying(true);
    try {
      await executeVerifyEmailMutation(input);
      setTimeout(() => {
        setIsVerifying(false);
        history.push(routes.onboarding.setPassword);
      }, 2500);
    } catch (error) {
      console.error(error);
      setError(error);
      setIsVerifying(false);
    }
  };

  const getState = () => {
    if (isVerifiying) {
      return (
        <Box mb={4}>
          <Typography variant="h5" mb={1}>
            Verificando tu correo <CircularProgress />
          </Typography>
          <Typography>Serás redirigido en un momento...</Typography>
        </Box>
      );
    }

    if (Boolean(error)) {
      return (
        <Box mb={4}>
          <Typography variant="h5" mb={1}>
            No pudimos verificar tu correo.
          </Typography>
          <Typography mb={2}>Es probable que haya expirado.</Typography>
          <Button
            color="primary"
            variant="outlined"
            size="large"
            onClick={onSendVerificationCode}
          >
            Reenviar código
          </Button>
        </Box>
      );
    }
  };

  return (
    <Box className={classes.drawerContainer}>
      <Modal
        onClose={() => {
          setIsModalOpen(false);
        }}
        open={isModalOpen}
      >
        <Box p={2} height="35vh">
          <Typography>
            Enviamos un correo a {sendEmailVerificationCodeInput.args.address}.
          </Typography>
        </Box>
      </Modal>
      <StepsSidebar>
        <SidebarNavigation history={history} location={location} {...props} />
      </StepsSidebar>
      <Container maxWidth="xs">
        <MobileAppBar />
        <ToolbarPadding />
        {getState()}
      </Container>
    </Box>
  );
};

export const VerifyEmail = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
