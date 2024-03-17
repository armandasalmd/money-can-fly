import { BaseImportProcessManager } from "./BaseImportProcessManager";
import constants from "@server/utils/Constants";

import { StartImportRequest } from "@endpoint/imports/start";
import { CookieUser } from "@server/core";
import { CurrencyRateManager, ImportSettingsManager } from "@server/managers";
import { IImportModel, IImportSettingsModel, ITransactionModel, ImportModel } from "@server/models";
import { escapeRegExp } from "@server/utils/Global";
import { CsvCellValueType, ImportCsvEntity, ImportRow } from "@server/utils/ImportCsvEntity";
import { ImportError } from "@server/utils/ImportError";
import { hashString } from "@server/utils/Global"
import { Category, Currency, ImportState, RowImportStatus } from "@utils/Types";
import { capitalise } from "@utils/Global";

export class ImportProcessManager extends BaseImportProcessManager {
  private csvEntity: ImportCsvEntity;
  private currencyRateManager: CurrencyRateManager;
  private globalUserSettings: IImportSettingsModel;
  private ignoreRegexes: RegExp[] = [];
  private rowsReadyToSave: ITransactionModel[] = [];
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

  private CreateImportHash(row: ImportRow): number {
    return hashString(`${row.amount}${row.currency}${row.category}${row.transactionDate}${row.description.substring(0, 3)}`);
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

  private GetFallbackCategory(description: string): Category {
    const category = Object.entries(this.globalUserSettings.categoryFallbacks).find(([_, terms]) => {
      return terms?.some((term: string | RegExp) => term instanceof RegExp && term.test(description)) ?? false;
    });

    return (category && (category[0] as Category)) || null;
  }
  
  private GetLogs() {
    if (this.logLimitReached) this.logs.push("Import logs limit reached. Truncating...");
    return this.logs;
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
      rowId: null
    }, this.options.dateFormat);

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

  private StepCleanupSwedbankDescription(rows: ImportRow[]) {
    rows?.forEach((row) => {
      if (row && row.description && row.description.startsWith("PIRKINYS"))
        row.description = row.description.replaceAll(/^PIRKINYS.*\(\d+\)\s/g, "");
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

  private async StepFlagDuplicates(rows: ImportRow[]): Promise<void> {
    const allTimes = rows.map(o => o.transactionDate.getTime());
    const existingHashSet = new Set(await this.transactionManager.SearchImportHashes(
      rows.map(o => o.importHash).filter(o => !!o),
      this.options.bank,
      new Date(Math.min(...allTimes)),
      new Date(Math.max(...allTimes))
    ));

    if (existingHashSet.size > 0) {
      rows.forEach(row => {
        if (row.importHash && existingHashSet.has(row.importHash)) {
          row.isDuplicate = true;
        }
      });
    }
  }

  private async StepProcessImportRows(): Promise<string> {
    let items: ImportRow[] = [];
    let ignoreCount = 0;

    for (let i = 0; i < this.csvEntity.count; i++) {
      const row = this.csvEntity.getImportRow(i);

      if (this.options.bank === "swedbank") {
        let isSpending = this.csvEntity.getCellValueAsAny(i, constants.swedbankDKColumnName) === "D";
        if (isSpending) {
          row.amount = -Math.abs(row.amount);
        }
      }

      if (this.IsIgnored(row.description)) {
        this.AddLog(`Row ${row.rowId} skipped - ignore term match - ${row.description}`);
        ignoreCount++;

        row.isActive = false; // Note: Ignored rows are still processed but inserted as inactive
      } else {
        row.isActive = true;
      }

      items.push(row);
    }

    if (this.options.bank === "barclays") this.StepCleanupBarclaysDescription(items);
    if (this.options.bank === "swedbank") this.StepCleanupSwedbankDescription(items);

    this.StepSetImportHashes(items);
    await this.StepFlagDuplicates(items);

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
        success: -ignoreCount,
      } as Record<RowImportStatus, number>
    );

    return `Imported ${statusMap.success}, skipped ${statusMap.skipped}, failed ${statusMap.failed}`;
  }

  private StepSetImportHashes(rows: ImportRow[]): void {
    rows?.forEach(row => {
      row.importHash = this.CreateImportHash(row);
    });
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
      if (row.isDuplicate) {
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
      importHash: row.importHash ?? 0,
      importId: this.importId,
      isActive: row.isActive,
      isImported: true,
      isInvestment: false,
      source: this.options.bank,
      usdValueWhenExecuted: commonValue,
      userUID: this.user.userUID,
    };
  }
}
