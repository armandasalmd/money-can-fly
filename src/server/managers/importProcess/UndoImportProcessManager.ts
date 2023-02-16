import { CookieUser } from "@server/core";
import { IImportModel, ImportModel } from "@server/models";
import { BaseImportProcessManager } from "./BaseImportProcessManager";

export class UndoImportProcessManager extends BaseImportProcessManager {
  public constructor(user: CookieUser, importId: string) {
    super(user, importId);
  }

  public async StartProcess(): Promise<IImportModel> {
    this.importModel = await ImportModel.findById(this.importId);

    if (
      !this.importModel ||
      this.importModel.userUID !== this.user.userUID ||
      this.importModel.importState !== "success"
    ) {
      return null;
    }

    this.importModel.importState = "running";
    this.importModel.message = "Running undo";

    await this.importModel.save();

    this.Run(); // in the background

    return this.importModel.toObject();
  }

  private async Run(): Promise<void> {
    const count = (await this.transactionManager.DeleteManyAndUncommit({
      isImported: true,
      importId: this.importModel.id,
      userUID: this.user.userUID
    }, this.importModel.balanceWasAltered)).length;

    this.importModel.importState = "undo";
    this.importModel.message = "Undone. Removed " + count + " transactions";

    await this.importModel.save();
  }
}
