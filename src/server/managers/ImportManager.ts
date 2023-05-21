import { CookieUser } from "@server/core";
import { IImportModel, ImportModel } from "@server/models";
import { ReadImportsResponse } from "@endpoint/imports/read";
import { SelectItem } from "@utils/SelectItems";
import { capitalise } from "@utils/Global";
import { ReadLogsResponse } from "@endpoint/imports/readLogs";

export class ImportManager {
  public constructor(private readonly user: CookieUser) {}

  public async ReadImports(skip: number, take: number): Promise<ReadImportsResponse> {
    const results = await ImportModel.find({ userUID: this.user.userUID }, {
      logs: 0,
    }).sort({ date: -1 }).skip(skip).limit(take);

    return {
      items: results.map((result) => result.toJSON<IImportModel>()),
      total: await ImportModel.countDocuments({ userUID: this.user.userUID }),
    };
  }

  public async ReadLogs(importId: string): Promise<ReadLogsResponse> {
    const importItem = await ImportModel.findOne({ userUID: this.user.userUID, _id: importId }, {
      logs: 1,
      message: 1,
      date: 1,
      balanceWasAltered: 1,
      source: 1,
      fileName: 1
    });

    return importItem ? {
      logs: importItem.logs? importItem.logs.split("\n") : [],
      message: importItem.message,
      date: importItem.date,
      balanceWasAltered: importItem.balanceWasAltered,
      source: importItem.source,
      fileName: importItem.fileName
    } : null;
  }

  public async GetImportsAsSelectItems(): Promise<SelectItem[]> {
    const imports = await ImportModel.find({ userUID: this.user.userUID, importState: "success" }).sort({ date: -1 });

    return imports.map((importItem) => ({
      value: importItem.id,
      label: capitalise(importItem.source) + " - " + importItem.date.toLocaleString(),
    }));
  }
}
