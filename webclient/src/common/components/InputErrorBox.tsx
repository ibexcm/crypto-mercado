import { Box, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { Typography } from "../../common/components";
import { errorHandler } from "../../libraries/error";
import { styles } from "../theme";

interface Props extends WithStyles {
  error: Error | null;
}

const minHeight = 49;

const Component: React.FC<Props> = ({ classes, error }) => {
  return (
    <Box mb={1}>
      {Boolean(error) ? (
        <Box
          className={classes.box}
          px={2}
          borderRadius={3}
          minHeight={minHeight}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Typography color="inherit" align="center">
            {errorHandler.getErrorMessage(error)}
          </Typography>
        </Box>
      ) : (
        <Box minHeight={minHeight} />
      )}
    </Box>
  );
};

export const InputErrorBox = withStyles((theme: Theme) => ({
  ...styles(theme),
  box: {
    backgroundColor: theme.palette.error.main,
    color: "white",
  },
}))(Component);
