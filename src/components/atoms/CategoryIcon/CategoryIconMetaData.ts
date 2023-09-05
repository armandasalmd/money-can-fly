import { IconComponentType } from "@utils/Types";
import { allCategories, CategoriesType, CategoryMetaData } from "@utils/Category";
import {
  Bank,
  Barbell,
  BeerBottle,
  Car,
  CalendarCheck,
  Confetti,
  FirstAid,
  ForkKnife,
  Hamburger,
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

interface IconCategoryMetaData extends CategoryMetaData {
  color: string;
  icon: IconComponentType;
}

const iconDefinitions: CategoriesType<IconCategoryMetaData> = {
  alcoholSmoking: {
    ...allCategories.alcoholSmoking,
    color: "#db5175",
    icon: BeerBottle
  },
  bills: {
    ...allCategories.bills,
    color: "#6b70ff",
    icon: Tag
  },
  car: {
    ...allCategories.car,
    color: "#f2a65a",
    icon: Car
  },
  deposits: {
    ...allCategories.deposits,
    color: "#ddedaa",
    icon: Bank
  },
  eatingOut: {
    ...allCategories.eatingOut,
    color: "#6bc3cf",
    icon: Hamburger
  },
  education: {
    ...allCategories.education,
    color: "#386fa4",
    icon: Student
  },
  entertainment: {
    ...allCategories.entertainment,
    color: "#2196F3",
    icon: Confetti
  },
  food: {
    ...allCategories.food,
    color: "#FFC107",
    icon: ForkKnife
  },
  gifts: {
    ...allCategories.gifts,
    color: "#E91E63",
    icon: Gift
  },
  health: {
    ...allCategories.health,
    color: "#4CAF50",
    icon: FirstAid
  },
  home: {
    ...allCategories.home,
    color: "#9C27B0",
    icon: House
  },
  investments: {
    ...allCategories.investments,
    color: "#cc9155",
    icon: ProjectorScreenChart
  },
  other: {
    ...allCategories.other,
    color: "#69818C",
    icon: Question
  },
  salary: {
    ...allCategories.salary,
    color: "#50992b",
    icon: CalendarCheck
  },
  shopping: {
    ...allCategories.shopping,
    color: "#FF5722",
    icon: ShoppingBag
  },
  sports: {
    ...allCategories.sports,
    color: "#699959",
    icon: Barbell
  },
  transport: {
    ...allCategories.transport,
    color: "#FF9800",
    icon: TrainSimple
  },
  trendDown: {
    ...allCategories.trendDown,
    color: "#f86262",
    icon: TrendDown
  },
  trendUp: {
    ...allCategories.trendUp,
    color: "#338f48",
    icon: TrendUp
  }
};

export default iconDefinitions;
