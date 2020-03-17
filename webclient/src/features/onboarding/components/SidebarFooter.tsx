import { Box, Grid, Theme, Typography, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { styles } from "../../../common/theme";
import { routes } from "../../../routes";

interface ISidebarFooterProps extends WithStyles, RouteComponentProps<{ id: string }> {}

const Component: React.FC<ISidebarFooterProps> = ({ classes, history, match }) => {
  return (
    <Box
      px={3}
      minHeight="10vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Grid container>
        <Grid item lg={10}>
          <Typography variant="body2">
            <Link to={routes.root} className={classes.sidebarNavigationLink}>
              Search
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export const SidebarFooter = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
