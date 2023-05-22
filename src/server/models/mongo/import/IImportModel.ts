import { BaseModel } from "../BaseModel";
import { ImportState, TransactionBank } from "@utils/Types";

export interface IImportModel extends BaseModel {  
  date: Date;
  source: TransactionBank;
  message: string;
  importState: ImportState;
  balanceWasAltered?: boolean;
  logs?: string;
  fileName: string;
}