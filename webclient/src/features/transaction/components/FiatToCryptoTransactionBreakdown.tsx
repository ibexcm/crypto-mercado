import { LazyQueryResult } from "@apollo/client";
import { Query } from "@ibexcm/libraries/api";
import { Box, Divider, Theme, WithStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Typography } from "../../../common/components";
import { styles } from "../../../common/theme";
import { QueryGetTransactionBreakdownArgs } from "../../../libraries/api";
import { TransactionBreakdownRow } from "./TransactionBreakdownRow";

interface Props extends WithStyles {
  getTransactionBreakdownState: LazyQueryResult<
    Pick<Query, "getTransactionBreakdown">,
    QueryGetTransactionBreakdownArgs
  >;
}

const Component: React.FC<Props> = ({ classes, getTransactionBreakdownState }) => {
  const { data, loading, error } = getTransactionBreakdownState;

  const {
    price,
    amount,
    fee,
    tax,
    total,
    exchangeRate,
  } = data?.getTransactionBreakdown || {
    price: { key: "Precio actual BTC", value: <CircularProgress size={20} /> },
    amount: { key: "Cantidad", value: <CircularProgress size={20} /> },
    fee: { key: "Comisión IBEX (...)", value: <CircularProgress size={20} /> },
    tax: { key: "IVA (...)", value: <CircularProgress size={20} /> },
    total: { key: "Total", value: <CircularProgress size={20} /> },
    exchangeRate: { key: "Tipo de cambio (...)", value: <CircularProgress size={20} /> },
  };

  return (
    <Box mb={3} textAlign="right">
      <Box mb={1}>
        <TransactionBreakdownRow pair={price} />
      </Box>
      <Typography variant="overline" color="primary" mb={3}>
        Desglose
      </Typography>
      <TransactionBreakdownRow pair={amount} />
      <TransactionBreakdownRow pair={fee} />
      <TransactionBreakdownRow pair={tax} />
      <Box my={1}>
        <Divider />
      </Box>
      <TransactionBreakdownRow pair={total} />
      {exchangeRate && <TransactionBreakdownRow pair={exchangeRate} />}
    </Box>
  );
};

export const FiatToCryptoTransactionBreakdown = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
