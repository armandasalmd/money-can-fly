import { BaseModel } from "../BaseModel";
import { Currency } from "@utils/Types";

export interface IUserPreferencesModel extends BaseModel {
  defaultCurrency: Currency;
  monthlyBudget: number;
  monthlyBudgetStartDay: number;
  balanceChartBreakpoints: number;
  forecastPivotDate: Date;
  forecastPivotValue: number;
}