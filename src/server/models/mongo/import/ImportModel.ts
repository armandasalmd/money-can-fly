import { Schema, model, Document, models, Model } from "mongoose";
import { IImportModel } from "./IImportModel";

const ImportSchema = new Schema<IImportModel>({
  balanceWasAltered: {
    type: Boolean,
    required: false,
    default: true,
  },
  userUID: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  importState: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  logs: {
    type: String,
    required: false,
  },
  fileName: {
    type: String,
    required: true,
  },
});

export interface ImportDocument extends IImportModel, Document {}
export default (models.import || model<IImportModel & Document>("import", ImportSchema)) as Model<IImportModel>;
