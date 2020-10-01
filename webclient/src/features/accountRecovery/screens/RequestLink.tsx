import { QueryRecoverAccountArgs } from "@ibexcm/libraries/api";
import { isValidEmail, isValidPhoneNumber } from "@ibexcm/libraries/validation";
import { Box, Container, Tab, Theme, withStyles, WithStyles } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import {
  Button,
  InputErrorBox,
  Modal,
  TextField,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { MobileNavBar, NavBar } from "../components";
import { RecoveryOption } from "../enum/RecoveryOption";
import { AccountRecoveryRepositoryInjectionKey } from "../InjectionKey";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const AccountRecoveryRepository = dependencies.provide(
    AccountRecoveryRepositoryInjectionKey,
  );

  const [recoveryOption, setRecoveryOption] = React.useState(RecoveryOption.email);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [shouldSendByEmail, setShouldSendByEmail] = React.useState(false);
  const [shouldSendBySMS, setShouldSendBySMS] = React.useState(false);

  const [inputError, setInputError] = React.useState<Error | null>(null);
  const [input, setInput] = React.useState<QueryRecoverAccountArgs>({
    args: {
      emailRecovery: {
        address: "",
      },
      smsRecovery: {
        number: "+502",
      },
    },
  });

  const {
    executeGetAccountRecoveryLink,
  } = AccountRecoveryRepository.useGetAccountRecoveryLink();

  const isEmailOptionActive = recoveryOption === RecoveryOption.email;

  React.useEffect(() => {
    try {
      if (isEmailOptionActive) {
        setShouldSendByEmail(isValidEmail(input.args.emailRecovery.address));
        return;
      }

      setShouldSendBySMS(isValidPhoneNumber(input.args.smsRecovery.number));
    } catch (error) {}
  }, [input.args.emailRecovery.address, input.args.smsRecovery.number]);

  const onSendLink = async () => {
    try {
      if (
        (isEmailOptionActive && !shouldSendByEmail) ||
        (!isEmailOptionActive && !shouldSendBySMS)
      ) {
        return;
      }

      await executeGetAccountRecoveryLink(input);
      setIsModalOpen(true);
    } catch (err) {
      setInputError(err);
    }
  };

  const onEmailInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputError(null);
    setInput({ args: { ...input.args, emailRecovery: { address: value } } });

    if (!shouldSendByEmail) {
      setInputError(new Error("Correo Inválido"));
    }
  };

  const onSMSInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputError(null);
    setInput({ args: { ...input.args, smsRecovery: { number: value } } });

    if (!shouldSendBySMS) {
      setInputError(new Error("Número Inválido"));
    }
  };

  const handleRecoveryOptionChange = (
    _event: React.ChangeEvent<{}>,
    newOption: RecoveryOption,
  ) => {
    setInputError(null);
    setRecoveryOption(newOption);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSendLink();
    }
  };

  const getOnSuccessMessage = () => {
    if (isEmailOptionActive) {
      return `Enviamos un correo a ${input.args.emailRecovery.address}`;
    }

    return `Enviamos un SMS a ${input.args.smsRecovery.number}`;
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
        <Box flexDirection="column" justifyContent="center" alignItems="center">
          <Typography align="center">{getOnSuccessMessage()}</Typography>
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
                <Tab label="Email" value={RecoveryOption.email} />
                <Tab label="SMS" value={RecoveryOption.sms} />
              </TabList>
              <TabPanel value={RecoveryOption.email}>
                <Box>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    onChange={onEmailInputChange}
                    value={input.args.emailRecovery.address}
                    mb={3}
                  />
                  <InputErrorBox error={inputError} />
                  {getButton(!shouldSendByEmail)}
                </Box>
              </TabPanel>
              <TabPanel value={RecoveryOption.sms}>
                <Box>
                  <TextField
                    fullWidth
                    label="Número de teléfono"
                    variant="outlined"
                    type="tel"
                    onChange={onSMSInputChange}
                    value={input.args.smsRecovery.number}
                    mb={3}
                  />
                  <InputErrorBox error={inputError} />
                  {getButton(!shouldSendBySMS)}
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
