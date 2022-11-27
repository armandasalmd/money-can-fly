import { atom } from "recoil";
import { Import } from "@utils/Types";

export interface ImportHistoryState {
  loading: boolean;
  page: number;
  pageSize: number;
  endReached: boolean;
  imports: Import[];
}

export const preferencesState = atom<ImportHistoryState>({
  key: "importHistory",
  default: {
    loading: true,
    page: 0,
    pageSize: 20,
    endReached: false,
    imports: [],
  }
});