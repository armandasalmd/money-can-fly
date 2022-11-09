import { useState } from "react";

export default function usePagination<T>(
  defaultItems: T[],
  itemsPerPage: number
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<T[]>(defaultItems);
  let maxPage = Math.ceil(items.length / itemsPerPage);

  if (maxPage < 1) maxPage = 1;

  function currentData(): T[] {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return items.slice(begin, end);
  }

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function jump(page: number) {
    const pageNumber = Math.max(1, page);
    setCurrentPage(() => Math.min(pageNumber, maxPage));
  }

  function setData(newItems: T[]) {
    setItems(newItems);

    if (
      newItems.length > 0 &&
      newItems.length <= (currentPage - 1) * itemsPerPage
    ) {
      jump(Math.ceil(newItems.length / itemsPerPage));
    }
  }

  return { next, prev, jump, currentData, currentPage, maxPage, setData };
}
