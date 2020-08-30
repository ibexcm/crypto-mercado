import React from "react";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { MobileNavBar, NavBar } from "../components";
import { TabPanel, TabContext, TabList } from "@material-ui/lab";
import { RouteComponentProps, StaticContext } from "react-router";
import { Box, Tab, Container, Theme, withStyles, WithStyles } from "@material-ui/core";
import {
  Button,
  InputErrorBox,
  TextField,
  ToolbarPadding,
  Typography,
} from "../../../common/components";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);

  const [emailError, setEmailError] = React.useState<Error | null>(null);
  const [smsError, setSmsError] = React.useState<Error | null>(null);
  const [recoveryOption, setRecoveryOption] = React.useState("1");

  const handleChange = (event: React.ChangeEvent<{}>, newOption: string) => {
    setRecoveryOption(newOption);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
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
            <Typography variant="h5" mb={1}>
              Restablece tu Contraseña
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
                onChange={handleChange}
                aria-label="Reset Password Methods"
                centered
              >
                <Tab label="Email" value="1" />
                <Tab label="SMS" value="2" />
              </TabList>
              <TabPanel value="1">
                <Box>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    mb={3}
                  />
                  <InputErrorBox error={emailError} />
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    size="large"
                    onKeyPress={onKeyPress}
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
                    mb={3}
                  />
                  <InputErrorBox error={smsError} />
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    size="large"
                    onKeyPress={onKeyPress}
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
