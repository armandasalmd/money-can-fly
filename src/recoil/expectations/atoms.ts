import { atom } from "recoil";
import { MonthPrediction } from "@utils/Types";

export const selectedMonthExpectation = atom<MonthPrediction | null>({
  key: "selectedMonthExpectation",
  default: null
});
