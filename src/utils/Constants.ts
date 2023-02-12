const constants = {
  appName: "MoneyCanFly",
  defaultTitle: "Money Can Fly",
  defaultErrorMessage: "Unexpected error",
  defaultPageSize: 25,
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
      title: "Expectations",
      path: "/predictions",
    },
    transactions: {
      title: "Transactions",
      path: "/transactions",
    },
  },
  publicRoutes: ["/login", "/register"],
  firebaseAuthErrors: {
    "auth/invalid-email": "Invalid email",
    "auth/user-not-found": "User not found",
    "auth/wrong-password": "Wrong password",
    "auth/email-already-in-use": "Email already in use",
    "auth/operation-not-allowed": "Operation not allowed",
    "auth/weak-password": "Weak password",
  },
  firebaseErrorRegex: /Firebase: (.*) \((.*)\)/
};

export default constants;
