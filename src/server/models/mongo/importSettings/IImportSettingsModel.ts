import { CategoryFallbacks } from "@utils/Types";
import { BaseModel } from "../BaseModel";
import constants from "@server/utils/Constants";

export interface IImportSettingsModel extends BaseModel {
  ignoreTerms: string[];
  categoryFallbacks: CategoryFallbacks;
}

export const defaultCategoryFallbacks: CategoryFallbacks = constants.allowed.categories.reduce((acc, category) => {
  acc[category] = [];
  return acc;
}, {} as CategoryFallbacks);