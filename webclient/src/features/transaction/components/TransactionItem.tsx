import { Box, Grid, Paper, Theme, WithStyles } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Typography } from "../../../common/components";
import { styles } from "../../../common/theme";
import { Transaction } from "../../../libraries/api";

interface Props extends WithStyles {
  transaction: Transaction;
  onClickTransactionItem: (transaction: Transaction) => void;
}

const Component: React.FC<Props> = ({ classes, transaction, onClickTransactionItem }) => {
  return (
    // <Hidden smUp>
    <Box
      mb={2}
      onClick={() => {
        onClickTransactionItem(transaction);
      }}
    >
      <Paper>
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              className={classes.currencies}
            >
              <Box className={classes.rowItemBox}>
                <Typography color="secondary" className={classes.amount}>
                  {transaction.amount}
                </Typography>
              </Box>
              <Box className={classes.rowItemBox}>
                <Typography color="secondary">
                  {transaction.receipt.fromCurrency.symbol}
                </Typography>
              </Box>
              <Box className={classes.rowItemBox}>
                <ArrowRightAltIcon color="disabled" />
              </Box>
              <Box className={classes.rowItemBox} pr={1}>
                <ScheduleIcon fontSize="small" color="primary" />
              </Box>
              <Box className={classes.rowItemBox}>
                <Typography color="primary">
                  {transaction.receipt.toCurrency.symbol}
                </Typography>
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
    </Box>
    // </Hidden>
  );
};

export const TransactionItem = withStyles((theme: Theme) => ({
  ...styles(theme),
  currencies: {
    "& p": {
      fontWeight: theme.typography.h5.fontWeight,
    },
  },
  amount: {
    textAlign: "right",
    paddingRight: theme.spacing(1),
  },
}))(Component);
