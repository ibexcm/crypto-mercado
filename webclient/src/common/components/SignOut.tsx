import { Box, Theme, withStyles, WithStyles } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import React from "react";
import { useHistory } from "react-router-dom";
import { AuthTokenRepositoryInjectionKeys } from "../../features/authentication/InjectionKeys";
import routes from "../../routes";
import DependencyContext from "../contexts/DependencyContext";
import { styles } from "../theme";
import { Button } from "./index";

interface Props extends WithStyles {}

const Component: React.FC<Props> = ({ classes }) => {
  const dependencies = React.useContext(DependencyContext);
  const authTokenRepository = dependencies.provide(AuthTokenRepositoryInjectionKeys);
  const signOutIcon = <ExitToAppIcon />;
  const history = useHistory();

  const onSignOut = () => {
    authTokenRepository.deleteAuthToken();
    history.push(routes.authentication.signIn);
  };

  return (
    <Box>
      <Button color="primary" variant="contained" onClick={onSignOut} endIcon={signOutIcon}>
        CERRAR SESIÓN
      </Button>
    </Box>
  );
};

export const SignOutButton = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
