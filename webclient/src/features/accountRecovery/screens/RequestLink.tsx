import React from "react";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { MobileNavBar, NavBar } from "../components";
import { TabPanel, TabContext, TabList } from "@material-ui/lab";
import {
  AccountRecoveryRepositoryInjectionKey,
  ValidationRepositoryInjectionKey,
} from "../InjectionKey";
import { RouteComponentProps, StaticContext } from "react-router";
import { Box, Tab, Container, Theme, withStyles, WithStyles } from "@material-ui/core";
import {
  Button,
  InputErrorBox,
  Modal,
  TextField,
  Typography,
} from "../../../common/components";
import { QueryRecoverAccountArgs } from "@ibexcm/libraries/api";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const ValidationRepository = dependencies.provide(ValidationRepositoryInjectionKey);
  const AccountRecoveryRepository = dependencies.provide(
    AccountRecoveryRepositoryInjectionKey,
  );

  const [recoveryOption, setRecoveryOption] = React.useState("1");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [emailError, setEmailError] = React.useState<Error | null>(null);
  const [smsError, setSmsError] = React.useState<Error | null>(null);

  const [emailDisable, setDisableEmail] = React.useState<boolean>(true);
  const [smsDisable, setDisableSms] = React.useState<boolean>(true);

  const [emailInput, setEmailInput] = React.useState<QueryRecoverAccountArgs>({
    args: {
      emailRecovery: {
        address: "",
      },
    },
  });
  const [smsInput, setSmsInput] = React.useState<QueryRecoverAccountArgs>({
    args: {
      smsRecovery: {
        number: "+502",
      },
    },
  });

  const [
    executeGetAccountRecoveryLink,
    { data, loading, error },
    setAuthToken,
  ] = AccountRecoveryRepository.useGetAccountRecoveryLink();

  const onSendLink = async () => {
    try {
      if (isByEmail()) {
        setEmailError(null);
        await executeGetAccountRecoveryLink(emailInput);
      } else {
        setSmsError(null);
        await executeGetAccountRecoveryLink(smsInput);
      }

      setAuthToken(data.recoverAccount.token);
    } catch (err) {
      if (!isByEmail()) {
        setEmailError(err);
      } else {
        setSmsError(err);
      }
    }
  };

  const handleRecoveryOptionChange = (event: React.ChangeEvent<{}>, newOption: string) => {
    setRecoveryOption(newOption);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSendLink();
    }
  };

  const onChangeEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!ValidationRepository.isValidEmail(value)) {
      setEmailError(new Error("Correo inválido"));
      setDisableEmail(true);
    } else {
      setDisableEmail(false);
      setEmailError(null);
    }
    setEmailInput({ args: { emailRecovery: { address: value } } });
  };

  const onChangeSmsInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!ValidationRepository.isValidPhone(value, "es-GT", { strictMode: true })) {
      setSmsError(new Error("Número inválido"));
      setDisableSms(true);
    } else {
      setSmsError(null);
      setDisableSms(false);
    }
    setSmsInput({ args: { smsRecovery: { number: value } } });
  };

  const isByEmail = (): boolean => {
    return smsInput.args.smsRecovery.number !== "+502";
  };

  const isBySms = (): boolean => {
    return emailInput.args.emailRecovery.address !== "";
  };

  return (
    <Box className={classes.homeContainer}>
      <Modal
        onClose={() => {
          setIsModalOpen(false);
        }}
        open={isModalOpen}
      >
        <Box flexDirection="column" justifyContent="center" alignItems="center">
          <Typography align="center">
            {!isByEmail()
              ? `Enviamos un correo a ${emailInput.args.emailRecovery.address}.`
              : `Enviamos un SMS a ${smsInput.args.smsRecovery.number}.`}
          </Typography>
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
              Recupera Tu cuenta
            </Typography>
            <Typography>
              Elige a donde quieres que se envíe el enlace de restablecimiento de
              contraseña.
            </Typography>
          </Box>
          <Box justifyContent="center">
            <TabContext value={recoveryOption}>
              <TabList
                variant="fullWidth"
                onChange={handleRecoveryOptionChange}
                aria-label="Reset Password Methods"
                centered
              >
                <Tab label="Email" value="1" disabled={isByEmail()} />
                <Tab label="SMS" value="2" disabled={isBySms()} />
              </TabList>
              <TabPanel value="1">
                <Box>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    onChange={onChangeEmailInput}
                    value={emailInput.args.emailRecovery.address}
                    mb={3}
                  />
                  <InputErrorBox error={emailError} />
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    size="large"
                    onKeyPress={onKeyPress}
                    onClick={onSendLink}
                    disabled={emailDisable}
                  >
                    Enviar
                  </Button>
                </Box>
              </TabPanel>
              <TabPanel value="2">
                <Box>
                  <TextField
                    fullWidth
                    label="Número de teléfono"
                    variant="outlined"
                    type="tel"
                    value={smsInput.args.smsRecovery.number}
                    onChange={onChangeSmsInput}
                    mb={3}
                  />
                  <InputErrorBox error={smsError} />
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    size="large"
                    onKeyPress={onKeyPress}
                    onClick={onSendLink}
                    disabled={smsDisable}
                  >
                    Enviar
                  </Button>
                </Box>
              </TabPanel>
            </TabContext>
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
