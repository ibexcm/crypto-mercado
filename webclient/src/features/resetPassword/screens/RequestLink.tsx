import React from "react";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { MobileNavBar, NavBar } from "../components";
import { TabPanel, TabContext, TabList } from "@material-ui/lab";
import { RouteComponentProps, StaticContext } from "react-router";
import {
  Box,
  Tab,
  Card,
  CardContent,
  Container,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";

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
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
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
            <Typography variant="h5" gutterBottom>
              Restablece tu Contraseña
            </Typography>
            <Card className={classes.warnCard}>
              <CardContent>
                <Typography align="center" variant="body2">
                  Elige a donde quieres que se envie tu enlace de restablecimiento de
                  contraseña.
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box>
            <TabContext value={value}>
              <TabList onChange={handleChange} aria-label="Reset Password Methods">
                <Tab label="Email" value="1" />
                <Tab label="SMS" value="2" />
              </TabList>
              <TabPanel value="1">
                <Box>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="text"
                    mb={3}
                  />
                  <InputErrorBox error={emailError} />
                  <Button color="primary" variant="contained" fullWidth size="large">
                    Enviar
                  </Button>
                </Box>
              </TabPanel>
              <TabPanel value="2">
                <Box>
                  <TextField
                    fullWidth
                    label="Número de Teléfono"
                    variant="outlined"
                    type="text"
                    mb={3}
                  />
                  <InputErrorBox error={smsError} />
                  <Button color="primary" variant="contained" fullWidth size="large">
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
