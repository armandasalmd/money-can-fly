import { BaseImportProcessManager } from "./BaseImportProcessManager";
import constants from "@server/utils/Constants";

import { StartImportRequest } from "@endpoint/imports/start";
import { CookieUser } from "@server/core";
import { CurrencyRateManager, ImportSettingsManager } from "@server/managers";
import { IImportModel, IImportSettingsModel, ITransactionModel, ImportModel } from "@server/models";
import { escapeRegExp } from "@server/utils/Global";
import { CsvCellValueType, ImportCsvEntity, ImportRow } from "@server/utils/ImportCsvEntity";
import { ImportError } from "@server/utils/ImportError";
import { Category, Currency, ImportState } from "@utils/Types";
import { capitalise } from "@utils/Global";

type RowImportStatus = "success" | "skipped" | "failed";

export class ImportProcessManager extends BaseImportProcessManager {
  private csvEntity: ImportCsvEntity;
  private currencyRateManager: CurrencyRateManager;
  private globalUserSettings: IImportSettingsModel;
  private ignoreRegexes: RegExp[] = [];
  private rowsReadyToSave: ITransactionModel[] = [];
  private sortedAscPossibleDuplicates: ITransactionModel[] = [];
  private logs: string[] = [];
  private logLimitReached = false;
  private now = new Date();

  public constructor(user: CookieUser, private readonly options: StartImportRequest) {
    super(user, null);
    this.currencyRateManager = CurrencyRateManager.getInstance();
  }

  private AddLog(log: string) {
    if (this.logs.length >= constants.importLogsLimit) {
      if (!this.logLimitReached) {
        this.logLimitReached = true;
      }
      if (log.match("failed")) {
        this.logs.shift();
        this.logs.push(log);
      }
      return;
    }

    this.logs.push(log);
  }

  private GetLogs() {
    if (this.logLimitReached) this.logs.push("Import logs limit reached. Truncating...");
    return this.logs;
  }

  private BinaryFindFirstDateOccurenceId(a: ITransactionModel[], targetTime: number) {
    if (!a || a.length === 0) return -1;
    let low = 0,
      high = a.length - 1;

    while (low <= high) {
      let mid = Math.floor(low + (high - low) / 2);

      if ((mid === 0 || a[mid - 1].date.getTime() < targetTime) && a[mid].date.getTime() === targetTime) {
        return mid;
      } else if (targetTime > a[mid].date.getTime()) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return -1;
  }

  private async CreateNewImport(): Promise<void> {
    this.importModel = new ImportModel({
      date: new Date(),
      source: this.options.bank,
      message: "Running",
      importState: "running",
      transactions: [],
      userUID: this.user.userUID,
      fileName: this.options.csvFileName
    });

    await this.importModel.save();

    this.importId = this.importModel.id;
  }

  private FilterPossibleDuplicates(row: ImportRow): ITransactionModel[] {
    const targetTime = row.transactionDate.getTime();
    const firstId = this.BinaryFindFirstDateOccurenceId(this.sortedAscPossibleDuplicates, targetTime);
    const a = this.sortedAscPossibleDuplicates;

    if (firstId < 0) return [];

    for (let i = firstId; i < a.length; i++) {
      if (a[i].date.getTime() !== targetTime) return a.slice(firstId, i);
      else if (i === a.length - 1) return a.slice(firstId);
    }

    return [a[firstId]];
  }

  private GetFallbackCategory(description: string): Category {
    const category = Object.entries(this.globalUserSettings.categoryFallbacks).find(([_, terms]) => {
      return terms?.some((term: string | RegExp) => term instanceof RegExp && term.test(description)) ?? false;
    });

    return (category && (category[0] as Category)) || null;
  }

  private HasDuplicate(row: ImportRow): boolean {
    return this.FilterPossibleDuplicates(row).some(
      (item) =>
        item.amount === row.amount &&
        item.description === row.description &&
        item.date?.getTime() === row.transactionDate?.getTime()
    );
  }

  private IsIgnored(desc: string) {
    return !desc || this.ignoreRegexes.some((regex) => regex.test(desc));
  }

  private async Run(): Promise<void> {
    console.time("Import " + this.importId + " finished");
    const { csvData } = this.options;

    if (typeof csvData !== "string" || csvData.length === 0) {
      return await this.UpdateState("error", "No CSV data provided");
    } else if (!this.importModel) {
      return await this.UpdateState("error", "Import model not provided");
    }

    // currencyRateManager.convert - Boosts performance & warm up cache.
    // Without it all parallel batch will clog up the queue
    const [userSettings] = await Promise.all([
      new ImportSettingsManager(this.user).GetSettings(),
      this.currencyRateManager.convert(1, "EUR", "USD", this.now),
    ]);

    this.globalUserSettings = userSettings;
    this.csvEntity = new ImportCsvEntity({
      amount: this.options.amountColumn,
      category: this.options.categoryColumn,
      currency: this.options.currencyColumn,
      description: this.options.descriptionColumn,
      transactionDate: this.options.transactionDateColumn,
      transactionFee: this.options.transactionFeeColumn,
      rowId: null,
    });

    try {
      this.csvEntity.load(csvData);
      this.StepSetIgnoreTerms();
      this.StepEscapeCategoryFallbackTerms();
      this.StepSetColumnTypes();

      // Main process. Fills this.rowsReadyToSave array
      const summary = await this.StepProcessImportRows();

      let saveSuccess = true;

      if (this.rowsReadyToSave.length > 0) {
        saveSuccess = await this.transactionManager.BulkInsert(this.rowsReadyToSave, this.options.alterBalance);
      }

      if (saveSuccess) {
        await this.UpdateState("success", summary);
      } else {
        await this.UpdateState("error", "Failed to save records to database");
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);

      await this.UpdateState("error", error instanceof ImportError ? error.importMessage : "Process failed");
    } finally {
      console.timeEnd("Import " + this.importId + " finished");
    }
  }

  public async StartProcess(): Promise<IImportModel> {
    console.log("Starting import for user " + this.user.email);
    await this.CreateNewImport();
    this.Run(); // in the background

    return this.importModel.toObject();
  }

  private StepCleanupBarclaysDescription(rows: ImportRow[]) {
    rows?.forEach((row) => {
      if (row && row.description)
        row.description = capitalise(row.description.replace(/ ON.*$/, "").trim().toLowerCase());
    });
  }

  private StepEscapeCategoryFallbackTerms() {
    for (const category in this.globalUserSettings.categoryFallbacks) {
      this.globalUserSettings.categoryFallbacks[category] =
        this.globalUserSettings.categoryFallbacks[category]?.map((term: string) => {
          return new RegExp(escapeRegExp(term), "i");
        }) ?? [];
    }
  }

  private async StepSetPossibleDuplicates(rows: ImportRow[]): Promise<void> {
    let minAmount = Infinity;
    let maxAmount = -Infinity;
    let minDate = new Date(0);
    let maxDate = new Date();

    for (const row of rows) {
      if (row.amount < minAmount) minAmount = row.amount;
      if (row.amount > maxAmount) maxAmount = row.amount;
      if (row.transactionDate < minDate) minDate = row.transactionDate;
      if (row.transactionDate > maxDate) maxDate = row.transactionDate;
    }

    this.sortedAscPossibleDuplicates = await this.transactionManager.ImportSearch(
      {
        source: this.options.bank,
        date: { $gte: minDate, $lte: maxDate },
        amount: { $gte: minAmount, $lte: maxAmount },
        isInvestment: false,
        userUID: this.user.userUID,
      },
      constants.importDuplicateSearchLimit
    );
  }

  private async StepProcessImportRows(): Promise<string> {
    const items: ImportRow[] = [];
    let ignoreCount = 0;

    for (let i = 0; i < this.csvEntity.count; i++) {
      const row = this.csvEntity.getImportRow(i);

      if (this.IsIgnored(row.description)) {
        this.AddLog(`Row ${row.rowId} skipped - ignore term match - ${row.description}`);
        ignoreCount++;
      } else {
        items.push(row);
      }
    }

    if (this.options.bank === "barclays") this.StepCleanupBarclaysDescription(items);

    await this.StepSetPossibleDuplicates(items);

    let position = 0;
    let results: RowImportStatus[] = [];

    while (position < items.length) {
      const toProcess = items.slice(position, position + constants.importBatchSize);
      const promisedResults: RowImportStatus[] = await Promise.all(toProcess.map((o) => this.StepSingleRow(o)));

      results = [...results, ...promisedResults];
      position += constants.importBatchSize;
    }

    const statusMap = results.reduce(
      (acc, curr) => {
        acc[curr]++;
        return acc;
      },
      {
        failed: 0,
        skipped: ignoreCount,
        success: 0,
      } as Record<RowImportStatus, number>
    );

    return `Imported ${statusMap.success}, skipped ${statusMap.skipped}, failed ${statusMap.failed}`;
  }

  private StepSetColumnTypes() {
    const importRowsAndTypes: Record<string, CsvCellValueType> = {
      [this.options.transactionDateColumn]: "date",
      [this.options.descriptionColumn]: "string",
      [this.options.amountColumn]: "number",
    };

    if (this.options.categoryColumn) {
      importRowsAndTypes[this.options.categoryColumn] = "string";
    }

    if (this.options.currencyColumn) {
      importRowsAndTypes[this.options.currencyColumn] = "string";
    }

    if (this.options.transactionFeeColumn) {
      importRowsAndTypes[this.options.transactionFeeColumn] = "number";
    }

    this.csvEntity.setColumnTypes(importRowsAndTypes);
  }

  private StepSetIgnoreTerms() {
    this.globalUserSettings.ignoreTerms.forEach((term) => {
      this.ignoreRegexes.push(new RegExp(escapeRegExp(term), "i"));
    });

    if (this.options.ignoreDescriptionPattern) {
      escapeRegExp(this.options.ignoreDescriptionPattern)
        .split(",")
        .forEach((term) => {
          typeof term === "string" && term.length > 0 && this.ignoreRegexes.push(new RegExp(term, "i"));
        });
    }
  }

  private async StepSingleRow(row: ImportRow): Promise<RowImportStatus> {
    if (row.amount === null || row.description === null || row.transactionDate === null) {
      this.AddLog(
        `Row ${row.rowId} failed - check ${row.amount === null ? "amount" : ""} ${
          row.description === null ? "description" : ""
        } ${row.transactionDate === null ? "date" : ""}`
      );
      return "failed";
    }

    if (row.amount === 0) {
      this.AddLog(`Row ${row.rowId} skipped - amount is 0`);
      return "skipped";
    }

    if (row.description.length === 0) row.description = "No description";

    try {
      if (this.HasDuplicate(row)) {
        this.AddLog(`Row ${row.rowId} skipped - duplicate`);
        return "skipped";
      }

      const defaultCategory: Category = row.amount < 0 ? "other" : "trendUp";

      if (!this.options.categoryColumn || !row.category) {
        row.category = this.GetFallbackCategory(row.description) || defaultCategory;
      } else {
        row.category = row.category.toLowerCase();

        if (!constants.allowed.categories.includes(row.category) || row.category === "other") {
          row.category = this.GetFallbackCategory(row.description) || defaultCategory;
        }
      }

      if (!this.options.currencyColumn || !constants.allowed.currencies.includes(row.currency.toUpperCase())) {
        row.currency = this.options.defaultCurrency;
      }

      if (!this.options.transactionFeeColumn || row.transactionFee === null) {
        row.transactionFee = 0;
      }

      row.amount -= Math.abs(row.transactionFee);

      this.rowsReadyToSave.push(await this.ToModel(row));

      return "success";
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
        this.AddLog(`Row ${row.rowId} failed - ${error.message}`);
      } else {
        this.AddLog(`Row ${row.rowId} failed - process exception`);
      }
      return "failed";
    }
  }

  private async UpdateState(state: ImportState, message: string): Promise<void> {
    this.importModel.message = message;
    this.importModel.importState = state;
    this.importModel.logs = this.GetLogs().join("\n");

    await this.importModel.save();
  }

  private async ToModel(row: ImportRow): Promise<ITransactionModel> {
    const commonValue = await this.currencyRateManager.convert(row.amount, row.currency as Currency, "USD", this.now);

    return {
      amount: row.amount,
      category: row.category as Category,
      currency: row.currency as Currency,
      date: row.transactionDate,
      dateUpdated: new Date(),
      description: row.description,
      importId: this.importId,
      isActive: true,
      isImported: true,
      isInvestment: false,
      source: this.options.bank,
      usdValueWhenExecuted: commonValue,
      userUID: this.user.userUID,
    };
  }
}
