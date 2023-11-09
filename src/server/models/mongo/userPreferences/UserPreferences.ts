import { Currency } from '@utils/Types';
import { Document, Model, model, models, Schema } from 'mongoose';

import { BaseModel } from '../BaseModel';

export interface IUserPreferencesModel extends BaseModel {
  defaultCurrency: Currency;
  monthlyBudget: number;
  monthlyBudgetStartDay: number;
  balanceChartBreakpoints: number;
  forecastPivotDate: Date;
  forecastPivotValue: number;
}


const UserPreferencesSchema = new Schema<IUserPreferencesModel>({
    userUID: {
      type: String,
      required: true,
    },
    defaultCurrency: {
      type: String,
      required: true,
    },
    monthlyBudget: {
      type: Number,
      required: true,
    },
    monthlyBudgetStartDay: {
      type: Number,
      required: true,
    },
    balanceChartBreakpoints: {
      type: Number,
      required: true,
    },
    forecastPivotDate: {
      type: Date,
      required: true,
    },
    forecastPivotValue: {
      type: Number,
      required: true,
    },
  });
  
  export interface UserPreferencesDocument extends IUserPreferencesModel, Document {}
  export default (models.userPreferences || model<IUserPreferencesModel & Document>("userPreferences", UserPreferencesSchema)) as Model<IUserPreferencesModel>;