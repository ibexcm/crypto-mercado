import { Box, Theme, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import { Link } from "react-router-dom";
import { Typography } from "../../../common/components";
import { styles } from "../../../common/theme";
import routes from "../../../routes";

export const drawerWidth = 420;

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext, {}> {}

const Component: React.FC<Props> = ({ classes, history }) => {
  const isSelected = (route: string): boolean => {
    const regexp = new RegExp(route, "gi");
    return regexp.test(history.location.pathname);
  };

  return (
    <Box px={3}>
      <Typography mb={4}>Crea una cuenta</Typography>
      <Box mb={2}>
        <Link
          to={routes.onboarding.sendEmailVerificationCode}
          className={
            isSelected(routes.onboarding.sendEmailVerificationCode) ||
            isSelected(routes.onboarding.verifyEmail)
              ? `${classes.sidebarNavigationSelectedLink} ${classes.sidebarNavigationLink}`
              : classes.sidebarNavigationLink
          }
        >
          <Typography variant="body2">Verifica tu email</Typography>
        </Link>
      </Box>
      <Box mb={2}>
        <Link
          to={routes.onboarding.setPassword}
          className={
            isSelected(routes.onboarding.setPassword)
              ? `${classes.sidebarNavigationSelectedLink} ${classes.sidebarNavigationLink}`
              : classes.sidebarNavigationLink
          }
        >
          <Typography variant="body2">Elige una contraseña</Typography>
        </Link>
      </Box>
      <Box mb={2}>
        <Link
          to={routes.onboarding.uploadGovernmentID}
          className={
            isSelected(routes.onboarding.uploadGovernmentID)
              ? `${classes.sidebarNavigationSelectedLink} ${classes.sidebarNavigationLink}`
              : classes.sidebarNavigationLink
          }
        >
          <Typography variant="body2">Verifica tu identidad</Typography>
        </Link>
      </Box>
      <Box mb={2}>
        <Link
          to={routes.onboarding.setBankAccount}
          className={
            isSelected(routes.onboarding.setBankAccount)
              ? `${classes.sidebarNavigationSelectedLink} ${classes.sidebarNavigationLink}`
              : classes.sidebarNavigationLink
          }
        >
          <Typography variant="body2">Elige una cuenta bancaria</Typography>
        </Link>
      </Box>
    </Box>
  );
};

export const SidebarNavigation = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
