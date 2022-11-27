import { SelectItem } from "@utils/SelectItems";

export class ImportCsvReader {
  public readRaw(file: File): Promise<string> {
    if (!ImportCsvReader.isCsvFile(file)) {
      return Promise.reject(new Error("File is not a CSV file"));
    } else if (!file) {
      return Promise.reject(new Error("File not found"));
    }

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result) {
          resolve(result.toString());
        } else {
          reject("Error reading file");
        }
      };
      reader.readAsText(file);
    });
  }

  public async readHeaderSelectItems(file: File): Promise<SelectItem[]> {
    const csv = await this.readRaw(file);
    const lines = csv.split("\n");

    if (lines.length < 2) {
      throw new Error("CSV file must have at least 2 lines");
    }

    const header = lines[0].split(",");
    const result: SelectItem[] = [];

    function isInResult(name: string): boolean {
      return result.some((item) => item.value === name);
    }

    for (let i = 0; i < header.length; i++) {
      if (!isInResult(header[i])) {
        result.push({ value: header[i], label: header[i] });
      }
    }

    return result;
  }

  private static isCsvFile(file: File): boolean {
    return file.type === "text/csv" || file.name.endsWith(".csv");
  }
}
