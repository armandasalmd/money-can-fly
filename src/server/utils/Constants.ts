import { allCategoryValues } from "@utils/Category";

const constants = {
  calibartionTerms: ["calibration", "calibrate", "calibrated", "calibrating"],
  allowed: {
    sources: ["barclays", "revolut", "swedbank", "cash"],
    currencies: ["USD", "EUR", "GBP"],
    categories: allCategoryValues,
    importStates: ["running", "success", "error"],
    amountFilters: [
      "incomeOnly",
      "spendingOnly",
      "moreThan10Spent",
      "moreThan25Spent",
      "moreThan50Spent",
      "moreThan100Spent",
      "moreThan250Spent",
    ],
    investmentEventTypes: ["deposit", "adjustment", "withdrawal", "created"],
  },
  sessionMaxAge: 259200, // number in seconds (3days)
  importBatchSize: 500,
  importLogsLimit: 250,
  swedbankDKColumnName: "D/K"
};

export default constants;
