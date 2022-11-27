import { ImportError } from "./ImportError";
import { isDecimal } from "class-validator";

export type CsvCellValueType = "string" | "number" | "date";

interface CsvHeader {
  name: string;
  valueType: CsvCellValueType;
}

interface CsvRow {
  values: string[];
}

export interface ImportRow {
  category?: string;
  transactionDate: Date;
  description: string;
  amount: number;
  currency?: string;
  transactionFee?: number;
}

export type ImportRowColmnMapping = {
  [key in keyof ImportRow]: string;
}

export class ImportCsvEntity {
  public headers: CsvHeader[] = [];
  public headerIds: { [name: string]: number } = {};
  public headerMappings: ImportRowColmnMapping;
  rows: CsvRow[] = [];
  
  public load(csv: string) {
    const lines = csv.split("\n");
    const headerLine = lines[0];
    const headerValues = headerLine.split(",");
    this.headers = headerValues.map((headerValue, index) => {
      this.headerIds[headerValue] = index;

      return {
        name: headerValue,
        valueType: "string",
      };
    });

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].replace("\r", "");
      
      if (line.indexOf(",") === -1) {
        continue;
      }
      
      const values = line.split(",");
      this.rows.push({
        values,
      });
    }
  }

  public assertHasAllColumns(names: string[]) {
    const missingColumns = names.filter((name) => {
      return !this.headers.find((header) => header.name === name);
    });

    if (missingColumns.length > 0) {
      throw new ImportError(
        `Missing columns: ${missingColumns.join(", ")}`
      );
    }
  }

  public setColumnType(name: string, type: CsvCellValueType) {
    const header = this.headers.find((header) => header.name === name);
    if (!header) {
      throw new ImportError(`Column ${name} not found`);
    }

    header.valueType = type;
  }

  public getImportRow(index: number): ImportRow {
    if (index < 0 || index >= this.rows.length) {
      throw new ImportError(`Row ${index} not found`);
    }

    const row = this.rows[index];
    const map = this.headerMappings;

    return {
      amount: this.getCellValue(row, map.amount) as number,
      description: this.getCellValue(row, map.description) as string,
      transactionDate: this.getCellValue(row, map.transactionDate) as Date,
      category: this.getCellValue(row, map.category) as string,
      currency: this.getCellValue(row, map.currency) as string,
      transactionFee: this.getCellValue(row, map.transactionFee) as number,
    };
  }

  private getCellValue(row: CsvRow, name: string): string | number | Date | null {
    if (!name || !row || !this.validateCellType(row, name)) {
      return null;
    }

    const header = this.headers[this.headerIds[name]];
    const rawValue: string = row.values[this.headerIds[name]];

    switch (header.valueType) {
      case "string":
        return rawValue;
      case "number":
        return parseFloat(rawValue);
      case "date":
        return new Date(rawValue.replace(/([0-9]+)\/([0-9]+)/,'$2/$1'));
      default:
        return null;
    }
  }

  private validateCellType(row: CsvRow, name: string): boolean {
    const headerId = this.headerIds[name];

    if (!headerId) false;

    const header = this.headers[headerId];
    const value = row.values[headerId];

    if (!header || !value) {
      return false;
    }

    switch (header.valueType) {
      case "string":
        return true;
      case "number":
        return isDecimal(value);
      case "date":
        return isFinite(+new Date(value.replace(/([0-9]+)\/([0-9]+)/,'$2/$1')));
      default:
        return false;
    }
  }

  public get count() {
    return this.rows.length;
  }
}