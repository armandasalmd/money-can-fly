import { Currency } from "@utils/Types";
import { IBalanceAnalysisSection } from "../mongo";
import { BalanceChartPoint } from "./BalanceChartPoint";
import { DateRange } from "react-day-picker";

export interface BalanceAnalysisModel {
  balanceDataset: BalanceChartPoint[];
  cardDescription: string;
  defaultCurrency: Currency;
  dateRange: DateRange;
  errorMessage?: string;
  expectationDataset: BalanceChartPoint[];
  investmentDataset: BalanceChartPoint[];
  settings: IBalanceAnalysisSection;
}
