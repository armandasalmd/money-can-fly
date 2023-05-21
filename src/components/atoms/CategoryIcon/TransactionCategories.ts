import { IconComponentType } from "@utils/Types";
import {
  Bank,
  CalendarCheck,
  Confetti,
  FirstAid,
  ForkKnife,
  Gift,
  House,
  Question,
  ProjectorScreenChart,
  ShoppingBag,
  Student,
  Tag,
  TrainSimple,
  TrendUp,
  TrendDown
} from "phosphor-react";

export interface TransactionCategory {
  color: string;
  icon: IconComponentType;
  name: string;
}

export type TransactionCategories = {
  [key: string]: TransactionCategory;
};

const mixedCategories: TransactionCategories = {
  investments: {
    color: "#f8b62b",
    icon: ProjectorScreenChart,
    name: "Investments",
  }
};

const incomeCategories: TransactionCategories = {
  deposits: {
    color: "#5fb041",
    icon: Bank,
    name: "Deposits",
  },
  salary: {
    color: "#2c994d",
    icon: CalendarCheck,
    name: "Salary",
  },
  trendUp: {
    color: "#338f48",
    icon: TrendUp,
    name: "Trend up"
  }
};

const transactionCategories: TransactionCategories = {
  food: {
    color: "#FFC107",
    icon: ForkKnife,
    name: "Food",
  },
  shopping: {
    color: "#FF5722",
    icon: ShoppingBag,
    name: "Shopping",
  },
  transport: {
    color: "#FF9800",
    icon: TrainSimple,
    name: "Transport",
  },
  health: {
    color: "#4CAF50",
    icon: FirstAid,
    name: "Health",
  },
  entertainment: {
    color: "#2196F3",
    icon: Confetti,
    name: "Entertainment",
  },
  education: {
    color: "#673AB7",
    icon: Student,
    name: "Education",
  },
  home: {
    color: "#9C27B0",
    icon: House,
    name: "Home",
  },
  bills: {
    color: "#3F51B5",
    icon: Tag,
    name: "Bills",
  },
  gifts: {
    color: "#E91E63",
    icon: Gift,
    name: "Gifts",
  },
  other: {
    color: "#69818C",
    icon: Question,
    name: "Other",
  },
  trendDown: {
    color: "#f86262",
    icon: TrendDown,
    name: "Trend down"
  }
};

const all = {...incomeCategories, ...transactionCategories, ...mixedCategories };

export default all;