import { Box, Grid, Paper, Theme, WithStyles } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "../../../common/components";
import { styles } from "../../../common/theme";
import routes from "../../../routes";

interface Props extends WithStyles {}

const Component: React.FC<Props> = ({ classes }) => {
  return (
    // <Hidden smUp>
    <Link to={routes.dashboard.transactions.index} className={classes.link}>
      <Paper>
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              className={classes.currencies}
              minHeight={48}
            >
              <Box display="flex" flexDirection="column" justifyContent="center">
                <Typography color="primary" className={classes.amount}>
                  20000000.00
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <Typography color="primary">GTQ</Typography>
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <ArrowRightAltIcon color="disabled" />
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="center">
                <Typography color="secondary">BTC</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight={48}
            >
              <ChevronRightIcon />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Link>
    // </Hidden>
  );
};

export const TransactionItem = withStyles((theme: Theme) => ({
  ...styles(theme),
  link: {
    textDecoration: "none",
    marginBottom: theme.spacing(2),
    display: "block",
  },
  currencies: {
    "& p": {
      fontWeight: theme.typography.h5.fontWeight,
    },
  },
  amount: {
    textAlign: "right",
    width: 120,
    paddingRight: theme.spacing(2),
  },
}))(Component);
