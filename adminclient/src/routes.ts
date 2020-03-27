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
  transactions: {
    purchases: "/transactions/purchases",
    sales: "/transactions/sales",
  },
};

export default routes;
