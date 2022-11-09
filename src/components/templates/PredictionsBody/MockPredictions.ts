import { MonthPrediction } from "@utils/Types";

const predictions: MonthPrediction[] = [
  {
    period: {
      from: new Date("2020-01-01"),
      to: new Date("2020-01-31"),
    },
    currency: "GBP",
    totalChange: 2000.2,
    predictions: [
      {
        week: 1,
        moneyIn: 1890.12,
        moneyOut: 512,
      },
      {
        week: 2,
        moneyIn: 53,
        moneyOut: 188,
      },
      {
        week: 3,
        moneyIn: 0,
        moneyOut: 96,
      },
      {
        week: 4,
        moneyIn: 0,
        moneyOut: 5,
      },
      {
        week: 4,
        moneyIn: 100,
        moneyOut: 56,
      },
    ],
  },
  {
    period: {
      from: new Date("2020-02-01"),
      to: new Date("2020-02-31"),
    },
    currency: "GBP",
    totalChange: -203.11,
    predictions: [
      {
        week: 1,
        moneyIn: 123.12,
        moneyOut: 500,
      },
      {
        week: 2,
        moneyIn: 53,
        moneyOut: 188,
      },
      {
        week: 3,
        moneyIn: 0,
        moneyOut: 96,
      },
      {
        week: 4,
        moneyIn: 96,
        moneyOut: 599,
      },
    ],
  },
  {
    period: {
      from: new Date("2020-03-01"),
      to: new Date("2020-03-31"),
    },
    currency: "GBP",
    totalChange: 1000.2,
    predictions: [
      {
        week: 1,
        moneyIn: 123.12,
        moneyOut: 500,
      },
      {
        week: 2,
        moneyIn: 53,
        moneyOut: 188,
      },
      {
        week: 3,
        moneyIn: 1500,
        moneyOut: 96,
      },
      {
        week: 4,
        moneyIn: 0,
        moneyOut: 5,
      },
    ],
  },
  {
    period: {
      from: new Date("2020-04-01"),
      to: new Date("2020-04-31"),
    },
    currency: "GBP",
    totalChange: 865.2,
    predictions: [
      {
        week: 1,
        moneyIn: 123.12,
        moneyOut: 500,
      },
      {
        week: 2,
        moneyIn: 53,
        moneyOut: 188,
      },
      {
        week: 3,
        moneyIn: 0,
        moneyOut: 96,
      },
      {
        week: 4,
        moneyIn: 0,
        moneyOut: 5,
      },
    ],
  },
];

export default predictions;
