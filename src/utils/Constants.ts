const constants = {
  appName: "MoneyCanFly",
  defaultTitle: "Money Can Fly",
  defaultErrorMessage: "Unexpected error",
  defaultPageSize: 10,
  env: process.env.NODE_ENV,
  navbarLinks: {
    dashboard: {
      title: "Dashboard",
      path: "/",
    },
    imports: {
      title: "Imports",
      path: "/import",
    },
    predictions: {
      title: "Predictions",
      path: "/predictions",
    },
    transactions: {
      title: "Transactions",
      path: "/transactions",
    },
  },
  publicRoutes: ["/login", "/register"],
};

export default constants;
