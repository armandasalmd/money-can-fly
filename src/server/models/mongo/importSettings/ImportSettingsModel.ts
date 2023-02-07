import { Schema, model, Document, models, Model } from "mongoose";
import { IImportSettingsModel, defaultCategoryFallbacks } from "./IImportSettingsModel";

const ImportSettingsSchema = new Schema<IImportSettingsModel>({
  userUID: {
    type: String,
    required: true,
  },
  ignoreTerms: {
    type: [String],
    required: true,
    default: [],
  },
  categoryFallbacks: {
    type: Object,
    required: true,
    default: defaultCategoryFallbacks,
  },
});

export interface ImportSettingsDocument extends IImportSettingsModel, Document {}
export default (models.importSettings ||
  model<IImportSettingsModel & Document>("importSettings", ImportSettingsSchema)) as Model<IImportSettingsModel>;
