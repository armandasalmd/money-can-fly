const constants = {
  appName: "MoneyCanFly",
  defaultTitle: "Money Can Fly",
  defaultErrorMessage: "Unexpected error",
  env: process.env.NODE_ENV,
  navbarLinks: [
    {
      title: "Dashboard",
      path: "/",
      default: true,
    },
    {
      title: "Transactions",
      path: "/transactions",
    },
    {
      title: "Imports",
      path: "/import",
    },
  ],
  publicRoutes: [
    "/login",
    "/register",
  ],
};

export default constants;
