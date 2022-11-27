import { Schema, model, Document, models, Model } from "mongoose";
import { IUserPreferencesModel } from "./IUserPreferencesModel";

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
});

export interface UserPreferencesDocument extends IUserPreferencesModel, Document {}
export default (models.userPreferences || model<IUserPreferencesModel & Document>("userPreferences", UserPreferencesSchema)) as Model<IUserPreferencesModel>;