import { Import } from "@utils/Types";
import { dateFromNow } from "@utils/Global";

export const mockImports: Import[] = [
  {
    id: "1",
    date: dateFromNow(-1),
    bank: "barclays",
    state: "running",
    message: "Running"
  },
  {
    id: "2",
    date: dateFromNow(-2),
    bank: "revolut",
    state: "success",
    message: "Imported 17, skipped 123"
  },
  {
    id: "3",
    date: dateFromNow(-3),
    bank: "cash",
    state: "error",
    message: "Error: Invalid file"
  },
  {
    id: "4",
    date: dateFromNow(-4),
    bank: "barclays",
    state: "running",
    message: "Running"
  },
  {
    id: "5",
    date: dateFromNow(-5),
    bank: "revolut",
    state: "success",
    message: "Imported 17, skipped 123"
  },
  {
    id: "6",
    date: dateFromNow(-2),
    bank: "revolut",
    state: "success",
    message: "Imported 17, skipped 123"
  },
  {
    id: "7",
    date: dateFromNow(-3),
    bank: "cash",
    state: "error",
    message: "Error: Invalid file"
  },
  {
    id: "8",
    date: dateFromNow(-4),
    bank: "barclays",
    state: "running",
    message: "Running"
  },
  {
    id: "9",
    date: dateFromNow(-5),
    bank: "revolut",
    state: "success",
    message: "Imported 17, skipped 123"
  },
  {
    id: "10",
    date: dateFromNow(-5),
    bank: "revolut",
    state: "success",
    message: "Imported 17, skipped 123"
  },
  {
    id: "11",
    date: dateFromNow(-1),
    bank: "barclays",
    state: "running",
    message: "Running"
  },
  {
    id: "12",
    date: dateFromNow(-2),
    bank: "revolut",
    state: "success",
    message: "Imported 17, skipped 123"
  },
  {
    id: "13",
    date: dateFromNow(-3),
    bank: "cash",
    state: "error",
    message: "Error: Invalid file"
  },
  {
    id: "14",
    date: dateFromNow(-4),
    bank: "barclays",
    state: "running",
    message: "Running"
  },
  {
    id: "15",
    date: dateFromNow(-5),
    bank: "revolut",
    state: "success",
    message: "Imported 17, skipped 123"
  },
  {
    id: "16",
    date: dateFromNow(-2),
    bank: "revolut",
    state: "success",
    message: "Imported 17, skipped 123"
  },
  {
    id: "17",
    date: dateFromNow(-3),
    bank: "cash",
    state: "error",
    message: "Error: Invalid file"
  },
  {
    id: "18",
    date: dateFromNow(-4),
    bank: "barclays",
    state: "running",
    message: "Running"
  },
];