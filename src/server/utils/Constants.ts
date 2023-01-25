const constants = {
  positiveCategories: ["deposits", "trendUp", "salary"],
  allowed: {
    sources: ["barclays", "revolut", "cash"],
    currencies: ["USD", "EUR", "GBP"],
    categories: [
      "food",
      "shopping",
      "transport",
      "health",
      "entertainment",
      "education",
      "home",
      "bills",
      "gifts",
      "other",
      "deposits",
      "salary",
      "trendUp",
      "trendDown",
    ],
    importStates: ["running", "success", "error"],
    transactionStatusFilters: ["active", "inactive"],
    amountFilters: [
      "incomeOnly",
      "moreThan10Spent",
      "moreThan25Spent",
      "moreThan50Spent",
      "moreThan100Spent",
      "moreThan250Spent",
    ],
    investmentEventTypes: ["deposit", "adjustment", "withdrawal", "created"],
  },
  objectIdRegex: /^[a-f\d]{24}$/i,
  sessionMaxAge: 24 * 60 * 60000 * 3, // 3 days
};

export default constants;
