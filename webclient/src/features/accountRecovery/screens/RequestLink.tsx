import React from "react";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { MobileNavBar, NavBar } from "../components";
import { TabPanel, TabContext, TabList } from "@material-ui/lab";
import { AccountRecoveryRepositoryInjectionKey } from "../InjectionKey";
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
import { RecoveryOption } from "../enum/RecoveryOption";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const AccountRecoveryRepository = dependencies.provide(
    AccountRecoveryRepositoryInjectionKey,
  );

  const [recoveryOption, setRecoveryOption] = React.useState(RecoveryOption.email);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [emailInputError, setEmailInputError] = React.useState<Error | null>(null);
  const [smsInputError, setSmsInputError] = React.useState<Error | null>(null);

  const [sendEmailButtonDisable, setEmailButtonDisable] = React.useState<boolean>(true);
  const [sendSmsButtonDisable, setSendSmsButtonDisable] = React.useState<boolean>(true);

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

  const {
    executeGetAccountRecoveryLink,
  } = AccountRecoveryRepository.useGetAccountRecoveryLink();

  const onSendLink = async () => {
    try {
      if (sendByEmail()) {
        setEmailInputError(null);
        await executeGetAccountRecoveryLink(emailInput);
      } else {
        setSmsInputError(null);
        await executeGetAccountRecoveryLink(smsInput);
      }
    } catch (err) {
      if (sendByEmail()) {
        setEmailInputError(err);
      } else {
        setSmsInputError(err);
      }
    }
  };

  const handleRecoveryOptionChange = (
    event: React.ChangeEvent<{}>,
    newOption: RecoveryOption,
  ) => {
    setRecoveryOption(newOption);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSendLink();
    }
  };

  const onChangeEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (true) {
      setEmailInputError(new Error("Correo inválido"));
      setEmailButtonDisable(true);
    } else {
      setEmailButtonDisable(false);
      setEmailInputError(null);
    }

    setEmailInput({ args: { emailRecovery: { address: value } } });
  };

  const onChangeSmsInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (true) {
      setSmsInputError(new Error("Número inválido"));
      setSendSmsButtonDisable(true);
    } else {
      setSmsInputError(null);
      setSendSmsButtonDisable(false);
    }

    setSmsInput({ args: { smsRecovery: { number: value } } });
  };

  const sendByEmail = (): boolean => {
    return emailInput.args.emailRecovery.address !== "";
  };

  const sendBySms = (): boolean => {
    return smsInput.args.smsRecovery.number !== "+502";
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
            {sendByEmail()
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
                <Tab
                  label="Email"
                  value={RecoveryOption.email}
                  disabled={shouldSendBySMS()}
                />
                <Tab
                  label="SMS"
                  value={RecoveryOption.sms}
                  disabled={shouldSendByEmail()}
                />
              </TabList>
              <TabPanel value={RecoveryOption.email}>
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
                  <InputErrorBox error={emailInputError} />
                </Box>
              </TabPanel>
              <TabPanel value={RecoveryOption.sms}>
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
                  <InputErrorBox error={smsInputError} />
                </Box>
              </TabPanel>
            </TabContext>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              size="large"
              onKeyPress={onKeyPress}
              onClick={onSendLink}
              disabled={sendSmsButtonDisable}
            >
              Enviar
            </Button>
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
