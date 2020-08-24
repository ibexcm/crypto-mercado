import { LazyQueryResult } from "@apollo/client";
import { Query } from "@ibexcm/libraries/api";
import { Box, Divider, Theme, WithStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Typography } from "../../../common/components";
import { styles } from "../../../common/theme";
import { QueryGetTransactionBreakdownArgs } from "../../../libraries/api";
import { IUpdateTransactionMethods } from "../interfaces/IUpdateTransactionMethods";
import { TransactionBreakdownRow } from "./TransactionBreakdownRow";

interface Props extends WithStyles {
  getTransactionBreakdownState: LazyQueryResult<
    Pick<Query, "getTransactionBreakdown">,
    QueryGetTransactionBreakdownArgs
  >;
  updateTransactionMethods: IUpdateTransactionMethods;
}

const Component: React.FC<Props> = ({
  classes,
  getTransactionBreakdownState,
  updateTransactionMethods,
}) => {
  const { data, loading, error } = getTransactionBreakdownState;

  const { price, amount, fee, total, priceAtRate } = data?.getTransactionBreakdown || {
    price: { key: "Precio BTC", value: <CircularProgress size={20} /> },
    amount: { key: "Cantidad", value: <CircularProgress size={20} /> },
    fee: { key: "Comisión IBEX (...)", value: <CircularProgress size={20} /> },
    total: { key: "Recibes", value: <CircularProgress size={20} /> },
    priceAtRate: { key: "Tipo de cambio (...)", value: <CircularProgress size={20} /> },
  };

  return (
    <Box mb={3} textAlign="right">
      <Box mb={1}>
        <TransactionBreakdownRow
          pair={price}
          onEditValue={updateTransactionMethods.onSetBasePrice}
        />
        {priceAtRate && (
          <TransactionBreakdownRow
            pair={priceAtRate}
            onEditKey={updateTransactionMethods.onSetExchangeRate}
          />
        )}
      </Box>
      <Typography variant="overline" color="primary" mb={3}>
        Desglose
      </Typography>
      <TransactionBreakdownRow pair={amount} />
      <TransactionBreakdownRow pair={fee} onEditKey={updateTransactionMethods.onSetFee} />
      <Box my={1}>
        <Divider />
      </Box>
      <TransactionBreakdownRow pair={total} />
    </Box>
  );
};

export const CryptoToFiatTransactionBreakdown = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
