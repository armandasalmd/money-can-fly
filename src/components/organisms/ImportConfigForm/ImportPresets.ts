import { ImportPresetType, TransactionBank, Currency } from "@utils/Types";

export interface ImportFormState {
  bank: TransactionBank;
  ignoreDescriptionPattern: string;
  defaultCurrency: Currency,
  hasCurrencyColumn: boolean;
  hasCategoryColumn: boolean;
  hasTransactionFeeColumn: boolean;
  categoryColumn: string;
  transactionDateColumn: string;
  descriptionColumn: string;
  amountColumn: string;
  currencyColumn?: string;
  transactionFeeColumn?: string;
}

export interface ImportPreset {
  type: ImportPresetType;
  formState: ImportFormState;
}

const customImportPreset: ImportPreset = {
  type: "custom",
  formState: {
    bank: "cash",
    ignoreDescriptionPattern: "",
    defaultCurrency: "GBP",
    categoryColumn: "",
    hasCurrencyColumn: false,
    hasTransactionFeeColumn: false,
    hasCategoryColumn: false,
    transactionDateColumn: "",
    descriptionColumn: "",
    amountColumn: "",
    currencyColumn: "",
    transactionFeeColumn: "",
  },
};

const barclaysImportPreset: ImportPreset = {
  type: "barclays",
  formState: {
    bank: "barclays",
    ignoreDescriptionPattern: "BARCLAYS",
    defaultCurrency: "GBP",
    categoryColumn: "",
    hasCurrencyColumn: false,
    hasTransactionFeeColumn: false,
    hasCategoryColumn: false,
    transactionDateColumn: "Date",
    descriptionColumn: "Memo",
    amountColumn: "Amount",
  },
};

const revolutImportPreset: ImportPreset = {
  type: "revolut",
  formState: {
    bank: "revolut",
    ignoreDescriptionPattern: "Cash at",
    defaultCurrency: "GBP",
    categoryColumn: "",
    hasCurrencyColumn: true,
    hasTransactionFeeColumn: true,
    hasCategoryColumn: false,
    transactionDateColumn: "Completed Date",
    descriptionColumn: "Description",
    amountColumn: "Amount",
    currencyColumn: "Currency",
    transactionFeeColumn: "Fee",
  },
}

type ImportPresetCollection = {
  [key in ImportPresetType]: ImportPreset;
}

const importPresets: ImportPresetCollection = {
  "custom": customImportPreset,
  "barclays": barclaysImportPreset,
  "revolut": revolutImportPreset,
};

export default importPresets;