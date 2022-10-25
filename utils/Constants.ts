const constants = {
  appName: "MoneyCanFly",
  defaultTitle: "Money Can Fly",
  defaultErrorMessage: "Unexpected error",
  env: process.env.NODE_ENV,
  navbarLinks: [
    {
      title: "Dashboard",
      path: "/",
      default: true
    },
    {
      title: "Transactions",
      path: "/transactions"
    },
    {
      title: "Import transactions",
      path: "/import"
    },
  ]
};

export default constants;
