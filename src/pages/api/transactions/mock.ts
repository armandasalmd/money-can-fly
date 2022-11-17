import { withUser } from "@server/core";

export default withUser((_, response, user) => {
  response.status(200).json([
    {
      id: "1",
      date: new Date("2021-01-01"),
      inserted: new Date(),
      category: "food",
      amount: -10,
      currency: "GBP",
      description: "McDonalds",
      source: "cash",
      active: true,
    },
    {
      id: "2",
      date: new Date("2021-01-02"),
      inserted: new Date("2022-01-10"),
      category: "deposits",
      amount: 200,
      currency: "USD",
      description: "Birthday gift",
      source: "cash",
      active: true,
    },
    {
      id: "3",
      date: new Date("2021-01-03"),
      inserted: new Date("2021-01-03"),
      category: "transport",
      amount: -30.21,
      currency: "EUR",
      description: "Uber",
      source: "cash",
      active: false,
    },
    {
      id: "4",
      date: new Date("2021-01-04"),
      inserted: new Date("2021-01-03"),
      category: "health",
      amount: -40,
      currency: "USD",
      description: "Doctor",
      source: "cash",
      active: false,
    },
    {
      id: "5",
      date: new Date("2021-01-05"),
      inserted: new Date("2021-01-03"),
      category: "entertainment",
      amount: -50,
      currency: "USD",
      description: "Movie",
      source: "cash",
      active: true,
    },
    {
      id: "6",
      date: new Date("2021-01-06"),
      inserted: new Date("2021-01-03"),
      category: "education",
      amount: -60,
      currency: "USD",
      description: "Books",
      source: "cash",
      active: true,
    },
    {
      id: "7",
      date: new Date("2021-01-07"),
      inserted: new Date("2021-01-03"),
      category: "home",
      amount: -70,
      currency: "USD",
      description: "Furniture",
      source: "cash",
      active: true,
    },
    {
      id: "8",
      date: new Date("2021-01-08"),
      inserted: new Date("2021-01-03"),
      category: "bills",
      amount: -80,
      currency: "USD",
      description: "Electricity",
      source: "cash",
      active: true,
    },
    {
      id: "9",
      date: new Date("2021-01-09"),
      inserted: new Date("2021-01-03"),
      category: "gifts",
      amount: -90,
      currency: "USD",
      description: "Gift",
      source: "cash",
      active: true,
    },
    {
      id: "10",
      date: new Date("2021-01-10"),
      inserted: new Date("2021-01-03"),
      category: "other",
      amount: -100,
      currency: "USD",
      description: "Other",
      source: "cash",
      active: true,
    },
    {
      id: "11",
      date: new Date("2021-01-11"),
      inserted: new Date("2021-01-03"),
      category: "deposits",
      amount: 110,
      currency: "USD",
      description: "Deposit",
      source: "cash",
      active: true,
    },
    {
      id: "12",
      date: new Date("2021-01-12"),
      inserted: new Date("2021-01-03"),
      category: "salary",
      amount: 120.12,
      currency: "USD",
      description: "Salary",
      source: "cash",
      active: true,
    },
    {
      id: "13",
      date: new Date("2021-01-13"),
      inserted: new Date("2021-01-03"),
      category: "transport",
      amount: -30.21,
      currency: "USD",
      description: "Uber",
      source: "cash",
      active: true,
    },
    {
      id: "14",
      date: new Date("2021-01-14"),
      inserted: new Date("2021-01-03"),
      category: "health",
      amount: -40,
      currency: "USD",
      description: "Doctor",
      source: "cash",
      active: true,
    },
    {
      id: "15",
      date: new Date("2021-01-15"),
      inserted: new Date("2021-01-03"),
      category: "entertainment",
      amount: -50,
      currency: "USD",
      description: "Movie",
      source: "cash",
      active: true,
    },
    {
      id: "16",
      date: new Date("2021-01-16"),
      inserted: new Date("2021-01-03"),
      category: "education",
      amount: -60,
      currency: "USD",
      description: "Books",
      source: "cash",
      active: true,
    },
    {
      id: "17",
      date: new Date("2021-01-17"),
      inserted: new Date("2021-01-03"),
      category: "home",
      amount: -70,
      currency: "USD",
      description: "Furniture",
      source: "cash",
      active: true,
    },
    {
      id: "18",
      date: new Date("2021-01-18"),
      inserted: new Date("2021-01-03"),
      category: "bills",
      amount: -80,
      currency: "USD",
      description: "Electricity",
      source: "cash",
      active: true,
    },
  ]);
});