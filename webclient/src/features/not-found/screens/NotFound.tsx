import React from "react";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { MobileNavBar, NavBar } from "../components";
import { ToolbarPadding, Typography } from "../../../common/components";
import { RouteComponentProps, StaticContext } from "react-router";
import { Box, Container, Theme, withStyles, WithStyles } from "@material-ui/core";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);

  return (
    <Box className={classes.homeContainer}>
      <MobileNavBar />
      <NavBar />
      <Container maxWidth="xs">
        <Box>
          <ToolbarPadding />
          <Box>
            <Typography variant="h5" mb={4}>
              Lo sentimos, No pudimos Encontrar la Página.
            </Typography>
            <img src="/svg/not-found.svg" alt="Not Found Image" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export const NotFound = withStyles((theme: Theme) => ({
  ...styles(theme),
  homeContainer: {
    backgroundColor: "white",
  },
}))(Component);
