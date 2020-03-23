export const routes = {
  root: "/",
  home: {},
  authentication: {
    authenticate: "/",
  },
  kyc: {
    approval: "/kyc/approval",
  },
  transactions: {
    purchases: "/transactions/purchases",
    sales: "/transactions/sales",
  },
};

export default routes;
