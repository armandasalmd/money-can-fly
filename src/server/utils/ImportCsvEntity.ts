import { ImportError } from "./ImportError";

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
  rowId: number;
}

export type ImportRowColumnMapping = Record<keyof ImportRow, string>;

export class ImportCsvEntity {
  public headers: CsvHeader[] = [];
  public headerIds: Record<string, number> = {};
  rows: CsvRow[] = [];

  constructor(public headerMappings: ImportRowColumnMapping) {}
  
  public load(csv: string) {
    const lines = csv.split("\n");
    const headerLine = lines[0].replace("\r", "");
    const headerValues = headerLine.split(",");

    if (lines[lines.length - 1].trim() === "") lines.pop();

    this.headers = headerValues.map((headerValue, index) => {
      this.headerIds[headerValue] = index;

      return {
        name: headerValue,
        valueType: "string",
      };
    });

    for (let i = 1; i < lines.length; i++) {
      this.rows.push({ values: lines[i].replace("\r", "").split(",") });
    }
  }

  public setColumnTypes(rowNameAndTypeMap: Record<string, CsvCellValueType>) {
    const missingColumns = [];

    for (const [name, type] of Object.entries(rowNameAndTypeMap)) {
      const header = this.headers.find((header) => header.name === name);

      if (!header) {
        missingColumns.push(name);
      } else {
        header.valueType = type;
      }
    }

    if (missingColumns.length > 0) {
      throw new ImportError(
        `Missing columns: ${missingColumns.join(", ")}`
      );
    }
  }

  public getImportRow(index: number): ImportRow {
    if (index < 0 || index >= this.rows.length) {
      throw new ImportError(`Row ${index} not found`);
    }

    const row = this.rows[index];
    const map = this.headerMappings;

    return {
      amount: this.getCellValue(row, map.amount) as number,
      description: this.getCellValue(row, map.description) as string || "Empty",
      transactionDate: this.getCellValue(row, map.transactionDate) as Date,
      category: this.getCellValue(row, map.category) as string,
      currency: this.getCellValue(row, map.currency) as string,
      transactionFee: this.getCellValue(row, map.transactionFee) as number,
      rowId: index + 2,
    };
  }

  private getCellValue(row: CsvRow, name: string): string | number | Date | null {
    const headerId = this.headerIds[name];
    
    if (!name || !row || typeof headerId !== "number") {
      return null;
    }

    const header = this.headers[headerId];
    const rawValue = row.values[headerId];

    if (!header || !rawValue) {
      return null;
    }

    switch (header.valueType) {
      case "string":
        return rawValue;
      case "number": {
        const parsedValue = parseFloat(rawValue);

        return isNaN(parsedValue) ? null : parsedValue;
      }
      case "date": {
        let parsedDate = new Date(rawValue.replace(/([0-9]+)\/([0-9]+)/,'$2/$1'));

        if (isFinite(+parsedDate)) {
          return parsedDate;
        } else {
          parsedDate = new Date(rawValue);
          return isFinite(+parsedDate) ? parsedDate : null;
        }

      }
      default:
        return null;
    }
  }

  public get count() {
    return this.rows.length;
  }
}