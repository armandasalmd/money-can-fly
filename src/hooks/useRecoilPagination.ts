import { useEffect } from "react";
import { RecoilState, useRecoilState } from "recoil";
import { callIfFunction } from "@utils/Global";

export interface IRecoilPaginationState<T> {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  displayedItems: T[];
  loading: boolean;
}

export interface IRecoilPaginationFetchResponse<T> {
  items: T[];
  totalItems: number;
}

type FetchFn<T> = (
  pageNumber: number,
  pageSize: number
) => Promise<IRecoilPaginationFetchResponse<T>>;

export default function useRecoilPagination<SingleItemType>(
  stateAtom: RecoilState<IRecoilPaginationState<SingleItemType>>,
  fetchFn: FetchFn<SingleItemType>,
  postFetchFn?: (items: SingleItemType[]) => void
) {
  const [state, setState] = useRecoilState(stateAtom);
  
  let maxPage = Math.ceil(state.totalItems / state.itemsPerPage);
  if (maxPage < 1) maxPage = 1;

  function executeFetch(pageNumber: number, pageSize: number) {
    setState((state) => ({
      ...state,
      loading: true,
    }));

    fetchFn(pageNumber, pageSize).then(({ items, totalItems }) => {
      setState((state) => ({
        ...state,
        loading: false,
        totalItems,
        displayedItems: items,
        currentPage: pageNumber,
      }));
      
      callIfFunction(postFetchFn, items);
    });
  }

  function jump(page: number) {
    const pageNumber = Math.max(1, page);

    executeFetch(Math.min(pageNumber, maxPage), state.itemsPerPage);
  }

  function next() {
    jump(state.currentPage + 1);
  }

  function prev() {
    jump(state.currentPage - 1);
  }

  function init() {
    executeFetch(1, state.itemsPerPage);
  }

  useEffect(() => {
    if (state.loading === null) {
      init();
    }
  }, []);

  return {
    prev,
    next,
    jump,
    reset: init,
    isEmpty: state.totalItems === 0,
    currentData: state.displayedItems,
    currentPage: state.currentPage,
    maxPage,
  };
}
