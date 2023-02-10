import { CookieUser } from "@server/core";
import { IImportModel, ImportDocument, ImportModel, ITransactionModel } from "@server/models";
import { ReadImportsResponse } from "@endpoint/imports/read";
import { StartImportRequest } from "@endpoint/imports/start";
import { CsvCellValueType, ImportCsvEntity, ImportRow } from "@server/utils/ImportCsvEntity";
import { ImportState } from "@utils/Types";
import { ImportError } from "@server/utils/ImportError";
import constants from "@server/utils/Constants";
import { escapeRegExp } from "@server/utils/Global";
import { TransactionManager } from "./TransactionManager";
import { CurrencyRateManager } from "./CurrencyRateManager";
import { SelectItem } from "@utils/SelectItems";
import { capitalise } from "@utils/Global";

type RowImportStatus = "success" | "skipped" | "failed";

export class ImportManager {
  private importModel: ImportDocument;
  private options: StartImportRequest;
  private csvEntity: ImportCsvEntity;
  private ignoreRegexes: RegExp[] = [];
  private existingTransactions: ITransactionModel[] = [];
  private rowsReadyToSave: ITransactionModel[] = [];

  private readonly user: CookieUser;
  private readonly transactionManager: TransactionManager;

  public constructor(user: CookieUser) {
    this.user = user;
    this.transactionManager = new TransactionManager(user);
  }

  public async ReadImports(skip: number, take: number): Promise<ReadImportsResponse> {
    const results = await ImportModel.find({ userUID: this.user.userUID }).sort({ date: -1 }).skip(skip).limit(take);

    return {
      items: results.map((result) => result.toJSON<IImportModel>()),
      total: await ImportModel.countDocuments({ userUID: this.user.userUID }),
    };
  }

  public async GetImportsAsSelectItems(): Promise<SelectItem[]> {
    const imports = await ImportModel.find({ userUID: this.user.userUID, importState: "success" }).sort({ date: -1 });

    return imports.map((importItem) => ({
      value: importItem.id,
      label: capitalise(importItem.source) + " - " + importItem.date.toLocaleString(),
    }));
  }

  private async UndoImport(): Promise<void> {
    const count = await this.transactionManager.UndoImport(this.importModel.id);

    this.importModel.importState = "undo";
    this.importModel.message = "Undone. Removed " + count + " transactions";
    await this.importModel.save();
  }

  public async RunUndoImportBackgroundProcess(importId: string): Promise<IImportModel> {
    this.importModel = await ImportModel.findById(importId);

    if (!this.importModel || this.importModel.userUID !== this.user.userUID || this.importModel.importState !== "success") {
      return null;
    }

    this.importModel.importState = "running";
    this.importModel.message = "Running undo";
    await this.importModel.save();

    this.UndoImport(); // in the background

    return this.importModel.toJSON<IImportModel>();;
  }

  public async RunImportBackgroundProcess(request: StartImportRequest): Promise<IImportModel> {
    const newImport: ImportDocument = new ImportModel({
      date: new Date(),
      source: request.bank,
      message: "Running",
      importState: "running",
      transactions: [],
      userUID: this.user.userUID,
    });

    console.log("Starting import for user " + this.user.email);

    await newImport.save();

    this.importModel = newImport;
    this.options = request;

    this.StartImport();

    return newImport.toJSON<IImportModel>();
  }

  private async UpdateState(state: ImportState, message: string): Promise<void> {
    if (this.importModel) {
      this.importModel.message = message;
      this.importModel.importState = state;

      await this.importModel.save();
    }
  }

  private async StartImport(): Promise<void> {
    console.log("Background process started");

    const { csvData } = this.options;

    if (typeof csvData !== "string" || csvData.length === 0) {
      await this.UpdateState("error", "No CSV data provided");
      return;
    }

    this.csvEntity = new ImportCsvEntity();

    try {
      this.csvEntity.load(csvData);
      this.csvEntity.headerMappings = {
        amount: this.options.amountColumn,
        category: this.options.categoryColumn,
        currency: this.options.currencyColumn,
        description: this.options.descriptionColumn,
        transactionDate: this.options.transactionDateColumn,
        transactionFee: this.options.transactionFeeColumn,
      };
      this.StepSetHeaderValueTypes();

      if (this.options.ignoreDescriptionPattern) {
        this.ignoreRegexes = escapeRegExp(this.options.ignoreDescriptionPattern)
          .split(",")
          .map((regex) => new RegExp(regex, "i"));
      }

      this.existingTransactions = await this.transactionManager.ImportSearch(this.options.bank, 2500);
      const successMessage = await this.StepImportRows();

      await this.UpdateState("success", successMessage);
    } catch (error) {
      if (error instanceof ImportError) {
        await this.UpdateState("error", error.importMessage);
      } else {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }

        await this.UpdateState("error", "Process failed");
      }
    }
  }

  private StepSetHeaderValueTypes() {
    const columns: string[] = [
      this.options.transactionDateColumn,
      this.options.descriptionColumn,
      this.options.amountColumn,
    ];

    const importRowTypes: {
      [key: string]: CsvCellValueType;
    } = {
      [this.options.transactionDateColumn]: "date",
      [this.options.descriptionColumn]: "string",
      [this.options.amountColumn]: "number",
    };

    if (this.options.categoryColumn) {
      columns.push(this.options.categoryColumn);
      importRowTypes[this.options.categoryColumn] = "string";
    }

    if (this.options.currencyColumn) {
      columns.push(this.options.currencyColumn);
      importRowTypes[this.options.currencyColumn] = "string";
    }

    if (this.options.transactionFeeColumn) {
      columns.push(this.options.transactionFeeColumn);
      importRowTypes[this.options.transactionFeeColumn] = "number";
    }

    this.csvEntity.assertHasAllColumns(columns);

    Object.entries(importRowTypes).forEach(([column, type]) => {
      this.csvEntity.setColumnType(column, type);
    });
  }

  private async StepImportRows(): Promise<string> {
    const statusCounts: {
      [key in RowImportStatus]: number;
    } = {
      success: 0,
      skipped: 0,
      failed: 0,
    };

    for (let i = 0; i < this.csvEntity.count; i++) {
      const row = this.csvEntity.getImportRow(i);
      const status = await this.StepImportRow(row);

      statusCounts[status]++;
    }

    await this.transactionManager.BulkInsert(this.rowsReadyToSave);

    return `Imported ${statusCounts.success}, skipped ${statusCounts.skipped}, failed ${statusCounts.failed}`;
  }

  private ImportRowExists(row: ImportRow): boolean {
    return this.existingTransactions.some((transaction) => {
      return (
        transaction.date.getTime() === row.transactionDate.getTime() &&
        transaction.amount === row.amount &&
        transaction.description === row.description
      );
    });
  }

  private async StepImportRow(row: ImportRow): Promise<RowImportStatus> {
    if (row.amount === null || row.description === null || row.transactionDate === null) {
      return "failed";
    }

    if (row.description.length === 0) {
      row.description = "No description";
    }

    if (this.ignoreRegexes.length > 0 && this.ignoreRegexes.some((regex) => regex.test(row.description))) {
      return "skipped";
    }

    if (row.amount === 0 || this.ImportRowExists(row)) {
      return "skipped";
    }

    if (!this.options.categoryColumn || row.category === null) {
      // TODO: Add CategoryManager to automatically try to categorize the transaction
      row.category = "other";
    } else {
      row.category = row.category.toLowerCase();

      if (constants.allowed.categories.indexOf(row.category) === -1) {
        row.category = "other";
      }
    }

    if (!this.options.currencyColumn || !constants.allowed.currencies.includes(row.currency.toUpperCase())) {
      row.currency = this.options.defaultCurrency;
    }

    if (!this.options.transactionFeeColumn || row.transactionFee === null) {
      row.transactionFee = 0;
    }

    row.amount -= Math.abs(row.transactionFee);

    const commonValue = await CurrencyRateManager.getInstance().convert(
      row.amount,
      row.currency as any,
      "USD",
      row.transactionDate
    );

    this.rowsReadyToSave.push({
      amount: row.amount,
      category: row.category as any,
      currency: row.currency as any,
      date: row.transactionDate,
      dateUpdated: new Date(),
      description: row.description,
      userUID: this.user.userUID,
      isActive: true,
      isImported: true,
      source: this.options.bank,
      usdValueWhenExecuted: commonValue,
      importId: this.importModel._id,
      isInvestment: false,
    });

    return "success";
  }
}
