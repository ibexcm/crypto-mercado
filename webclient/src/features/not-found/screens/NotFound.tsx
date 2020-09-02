import { Box, Container, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import { Typography } from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { MobileNavBar, NavBar } from "../components";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);

  return (
    <Box>
      <Box className={classes.homeContainer}>
        <Container maxWidth="lg" className={classes.introContainer}>
          <MobileNavBar />
          <NavBar />
          <Box
            minHeight="70vh"
            flexDirection="column"
            display="flex"
            justifyContent="center"
            py={18}
          >
            <Box className={classes.notFoundHeader}>
              <Typography variant="h1">
                Lo sentimos,{" "}
                <Typography component="span">No podemos encontrar la página.</Typography>
              </Typography>
            </Box>
            <Box className={classes.piggyBank} my={4}>
              <img src="/svg/not-found.svg" width="auto" height="auto" />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export const NotFound = withStyles((theme: Theme) => ({
  ...styles(theme),
  homeContainer: {
    backgroundColor: theme.palette.grey[200],
  },
  notFoundHeader: {
    textAlign: "center",
    color: theme.palette.black,
    "& h1": {
      fontSize: theme.typography.h3.fontSize,
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.h3.fontSize,
      },
    },
    "& span": {
      display: "block",
      fontSize: theme.typography.h3.fontSize,
      [theme.breakpoints.up("sm")]: {
        fontSize: theme.typography.h3.fontSize,
      },
    },
  },
  piggyBank: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
}))(Component);
