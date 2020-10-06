import { QueryRecoverAccountArgs } from "@ibexcm/libraries/api";
import { Box, Container, Tab, Theme, withStyles, WithStyles } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import React from "react";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import SmsOutlinedIcon from "@material-ui/icons/SmsOutlined";
import { RouteComponentProps, StaticContext } from "react-router";
import {
  Button,
  Modal,
  Typography,
  EmailInput,
  PhoneNumberInput,
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

  const [error, setError] = React.useState<Error | null>(null);
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

  const onSendLink = async () => {
    try {
      await executeGetAccountRecoveryLink(input);
      setIsModalOpen(true);
    } catch (error) {
      setError(error);
    }
  };

  const handleRecoveryOptionChange = (
    _event: React.ChangeEvent<{}>,
    newOption: RecoveryOption,
  ) => {
    setError(null);
    setRecoveryOption(newOption);
  };

  const setEmail = (email: string) => {
    setInput({ ...input, args: { emailRecovery: { address: email } } });
  };

  const setPhoneNumber = (number: string) => {
    setInput({ ...input, args: { smsRecovery: { number } } });
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSendLink();
    }
  };

  const getOnSuccessMessage = () => {
    if (isEmailOptionActive) {
      return (
        <>
          <MailOutlineIcon fontSize="large" color="primary" />
          <Typography align="center">
            Enviamos un correo a {input.args.emailRecovery?.address}
          </Typography>
        </>
      );
    }

    return (
      <>
        <SmsOutlinedIcon fontSize="large" color="primary" />
        <Typography align="center">
          Enviamos un SMS a {input.args.smsRecovery?.number}
        </Typography>
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
                <EmailInput
                  value={input.args.emailRecovery?.address || ""}
                  error={error}
                  parentInputState={setEmail}
                  shouldEmailBeSent={setShouldSendByEmail}
                />
                <Box>{getButton(!shouldSendByEmail)}</Box>
              </TabPanel>
              <TabPanel value={RecoveryOption.sms}>
                <PhoneNumberInput
                  value={input.args.smsRecovery?.number || "+502"}
                  error={error}
                  parentInputState={setPhoneNumber}
                  shouldSMSBeSent={setShouldSendBySMS}
                />
                <Box>{getButton(!shouldSendBySMS)}</Box>
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
