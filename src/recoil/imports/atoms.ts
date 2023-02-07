import { atom } from "recoil";

import { defaultCategoryFallbacks, IImportSettingsModel } from "@server/models/mongo/importSettings/IImportSettingsModel";

export const importSettingsAtom = atom<IImportSettingsModel>({
  key: "importSettings",
  default: {
    userUID: null,
    ignoreTerms: [],
    categoryFallbacks: defaultCategoryFallbacks,
  },
});
