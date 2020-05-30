export const routes = {
  root: "/",
  home: {},
  authentication: {
    authenticate: "/",
  },
  kyc: {
    approval: "/kyc/approval",
    evaluate: "/kyc/evaluate/user/:id",
  },
  transaction: {
    fiatToCryptoTransactions: "/transactions/fiat-to-crypto",
    cryptoToFiatTransactions: "/transactions/crypto-to-fiat",
    details: "/tx/:id",
  },
};

export default routes;
