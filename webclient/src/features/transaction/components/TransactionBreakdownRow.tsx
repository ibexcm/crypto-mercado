import { Grid, Theme, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Typography } from "../../../common/components";
import { styles } from "../../../common/theme";

interface Props extends WithStyles {
  pair: { key: any; value: any };
}

const Component: React.FC<Props> = ({ classes, pair }) => {
  return (
    <Grid container justify="flex-end" spacing={1}>
      <Grid item xs={6} lg={7}>
        <Typography color="textSecondary" component="span">
          {pair.key}
        </Typography>
      </Grid>
      <Grid item xs={6} lg={5}>
        <Typography component="span">{pair.value}</Typography>
      </Grid>
    </Grid>
  );
};

export const TransactionBreakdownRow = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
