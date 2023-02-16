import { CookieUser } from "@server/core";
import { IImportModel, ImportDocument } from "@server/models";
import { TransactionManager } from "../TransactionManager";

export abstract class BaseImportProcessManager {
  protected importModel: ImportDocument;
  protected readonly transactionManager: TransactionManager;

  constructor(protected readonly user: CookieUser, protected importId: string) {
    this.transactionManager = new TransactionManager(user);
  }

  public abstract StartProcess(): Promise<IImportModel>;
}
