export const routes = {
  root: "/",
  home: {},
  authentication: {
    authenticate: "/",
  },
  kyc: {
    users: "/kyc/users",
    approval: "/kyc/approval",
    evaluate: "/kyc/evaluate/user/:id",
  },
  transaction: {
    fiatToCryptoTransactions: "/transactions/fiat-to-crypto",
    cryptoToFiatTransactions: "/transactions/crypto-to-fiat",
    details: "/tx/:id",
  },
  settings: {
    exchangeRate: "/settings/exchange-rate",
  },
};

export default routes;
