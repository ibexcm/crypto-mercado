import { QueryRecoverAccountArgs } from "@ibexcm/libraries/api";
import { Box, Container, Theme, withStyles, WithStyles } from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import { Button, EmailInput, Modal, Typography } from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { MobileNavBar, NavBar } from "../components";
import { AccountRecoveryRepositoryInjectionKey } from "../InjectionKey";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const AccountRecoveryRepository = dependencies.provide(
    AccountRecoveryRepositoryInjectionKey,
  );

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [input, setInput] = React.useState<QueryRecoverAccountArgs>({
    args: { address: "" },
  });

  const {
    executeGetAccountRecoveryLink,
    state: {
      error: executeGetAccountRecoveryLinkError,
      data: executeGetAccountRecoveryLinkStatus,
    },
  } = AccountRecoveryRepository.useGetAccountRecoveryLink();

  React.useEffect(() => {
    if (!Boolean(executeGetAccountRecoveryLinkError)) {
      return;
    }

    setError(executeGetAccountRecoveryLinkError);
  }, [executeGetAccountRecoveryLinkError]);

  React.useEffect(() => {
    if (typeof executeGetAccountRecoveryLinkStatus?.recoverAccount === "undefined") {
      return;
    } else if (
      typeof executeGetAccountRecoveryLinkStatus?.recoverAccount === "boolean" &&
      !Boolean(executeGetAccountRecoveryLinkStatus?.recoverAccount)
    ) {
      setError(new Error("Falló el envío del correo"));
      return;
    }

    setError(null);
    setIsModalOpen(true);
  }, [executeGetAccountRecoveryLinkStatus]);

  const onSendLink = async () => {
    try {
      await executeGetAccountRecoveryLink(input);
    } catch (error) {
      setError(error);
    }
  };

  const setEmail = (address: string) => {
    setInput({
      args: { address },
    });
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSendLink();
    }
  };

  const getOnSuccessMessage = () => {
    return (
      <>
        <MailOutlineIcon fontSize="large" color="primary" />
        <Typography align="center">Enviamos un correo a {input.args?.address}</Typography>
      </>
    );
  };

  const getButton = (disabled: boolean) => (
    <Button
      color="primary"
      variant="contained"
      fullWidth
      size="large"
      onKeyPress={onKeyPress}
      onClick={onSendLink}
      disabled={disabled}
    >
      Enviar
    </Button>
  );

  return (
    <Box className={classes.homeContainer}>
      <Modal
        onClose={() => {
          setIsModalOpen(false);
        }}
        open={isModalOpen}
      >
        <Box
          p={2}
          height="35vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            width={70}
            height={70}
            borderRadius="50%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mb={3}
          >
            {getOnSuccessMessage()}
          </Box>
        </Box>
      </Modal>
      <MobileNavBar />
      <NavBar />
      <Container maxWidth="xs">
        <Box
          minHeight="100vh"
          flexDirection="column"
          display="flex"
          justifyContent="center"
        >
          <Box mb={4}>
            <Typography variant="h5" mb={1}>
              Recupera Tu Cuenta
            </Typography>
            <Typography>
              Ingresa la dirección de correo a donde deseas que enviemos el enlace de
              restablecimiento
            </Typography>
          </Box>
          <Box justifyContent="center">
            <EmailInput
              value={input?.args?.address}
              error={error}
              onError={setError}
              onChange={setEmail}
            />
            <Box>{getButton(Boolean(error) || !Boolean(input?.args?.address))}</Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export const RequestLink = withStyles((theme: Theme) => ({
  ...styles(theme),
  homeContainer: {
    backgroundColor: "white",
  },
}))(Component);
