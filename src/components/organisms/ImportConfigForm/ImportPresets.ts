import { ImportPresetType, TransactionBank, Currency } from "@utils/Types";

export interface ImportFormState {
  alterBalance: boolean;
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
    alterBalance: true,
    bank: "cash",
    ignoreDescriptionPattern: "Empty",
    defaultCurrency: "USD",
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
    alterBalance: true,
    bank: "barclays",
    ignoreDescriptionPattern: "BARCLAYS,Empty",
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
    alterBalance: true,
    bank: "revolut",
    ignoreDescriptionPattern: "Cash at,Empty",
    defaultCurrency: "EUR",
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
};

const swedbankImportPreset: ImportPreset = {
  type: "swedbank",
  formState: {
    alterBalance: true,
    bank: "swedbank",
    ignoreDescriptionPattern: "Apyvarta,Likutis",
    defaultCurrency: "EUR",
    categoryColumn: "",
    hasCurrencyColumn: true,
    hasTransactionFeeColumn: false,
    hasCategoryColumn: false,
    transactionDateColumn: "Data",
    descriptionColumn: "Paaiškinimai",
    amountColumn: "Suma",
    currencyColumn: "Valiuta",
  },
}

type ImportPresetCollection = {
  [key in ImportPresetType]: ImportPreset;
}

const importPresets: ImportPresetCollection = {
  "custom": customImportPreset,
  "barclays": barclaysImportPreset,
  "revolut": revolutImportPreset,
  "swedbank": swedbankImportPreset
};

export default importPresets;