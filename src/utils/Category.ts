type CategoryNegative =
  | "alcoholSmoking"
  | "bills"
  | "car"
  | "education"
  | "eatingOut"
  | "entertainment"
  | "food"
  | "gifts"
  | "health"
  | "home"
  | "other"
  | "shopping"
  | "sports"
  | "transport"
  | "trendDown";
type CategoryPositive = "deposits" | "salary" | "trendUp";
type CaterogyMixed = "investments";

export type Category = CategoryNegative | CategoryPositive | CaterogyMixed;
export type SearchCategory = Category | "notInvestments";

export interface CategoryMetaData {
  label: string;
  isPositive?: boolean;
  value: Category;
}

export type CategoriesType<T extends CategoryMetaData = CategoryMetaData> = {
  [K in Category]: T & {
    value: K;
  };
};

export const allCategories: CategoriesType = {
  alcoholSmoking: { 
    label: "Alcohol & Smoking",
    value: "alcoholSmoking",
    isPositive: false
  },
  bills: {
    label: "Bills",
    value: "bills",
    isPositive: false
  },
  car: {
    label: "Car",
    value: "car",
    isPositive: false
  },
  deposits: {
    label: "Deposits",
    value: "deposits",
    isPositive: true
  },
  eatingOut: {
    label: "Eating out",
    value: "eatingOut",
    isPositive: false
  },
  education: {
    label: "Education",
    value: "education",
    isPositive: false
  },
  entertainment: {
    label: "Enterntainment",
    value: "entertainment",
    isPositive: false
  },
  food: {
    label: "Groceries",
    value: "food",
    isPositive: false
  },
  gifts: {
    label: "Gifts",
    value: "gifts",
    isPositive: false
  },
  health: {
    label: "Health",
    value: "health",
    isPositive: false
  },
  home: {
    label: "Home",
    value: "home",
    isPositive: false
  },
  investments: {
    label: "Investments",
    value: "investments",
    isPositive: undefined
  },
  other: {
    label: "Other",
    value: "other",
    isPositive: false
  },
  salary: {
    label: "Salary",
    value: "salary",
    isPositive: true
  },
  shopping: {
    label: "Shopping",
    value: "shopping",
    isPositive: false
  },
  sports: {
    label: "Sports",
    value: "sports",
    isPositive: false
  },
  transport: {
    label: "Transport",
    value: "transport",
    isPositive: false
  },
  trendDown: {
    label: "Trend down",
    value: "trendDown",
    isPositive: false
  },
  trendUp: {
    label: "Trend up",
    value: "trendUp",
    isPositive: true
  }
};

export function getCategoryByLabel(label: string): CategoryMetaData | null {
  return Object.values(allCategories).find(o => o.label === label) ?? null;
}

export function isNegative(category: Category) {
  return allCategories[category].isPositive === false;
}

export const allCategoryValues = Object.keys(allCategories);
