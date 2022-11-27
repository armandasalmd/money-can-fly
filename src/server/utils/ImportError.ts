export class ImportError extends Error {
  public readonly importMessage: string;

  constructor(importMessage: string) {
    super("Import failed");
    this.importMessage = importMessage;
  }
}