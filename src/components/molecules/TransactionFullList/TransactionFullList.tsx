import { useRecoilValue } from "recoil";

import TransactionFullListItem from "./TransactionFullListItem";
import { Pagination, mockTransactions } from "@molecules/index";
import { useRecoilPagination, IRecoilPaginationFetchResponse } from "@hooks/index";
import { Transaction } from "@utils/Types";
import { Empty } from "@atoms/index";
import { pagedTransactionsState, filterFormState, TransactionForm } from "@recoil/transactions/atoms";

export interface PredictionPreviewListProps {
  selectedTransactions: Transaction[];
  setSelectedTransactions: (transactions: Transaction[]) => void;
  scrollToTop: () => void;
}

export default function TransactionFullList(props: PredictionPreviewListProps) {
  const { selectedTransactions, setSelectedTransactions } = props;
  const filterForm = useRecoilValue(filterFormState);
  const { currentData, currentPage, maxPage, jump, isEmpty } = useRecoilPagination<Transaction>(
    pagedTransactionsState, mockFetchTransactions, postPageChange);

  function onSelect(t: Transaction) {
    if (selectedTransactions.includes(t)) {
      setSelectedTransactions([
        ...selectedTransactions.filter((st) => st.id !== t.id),
      ]);
    } else {
      setSelectedTransactions([...selectedTransactions, t]);
    }
  }

  async function mockFetchTransactions(page: number, size: number): Promise<IRecoilPaginationFetchResponse<Transaction>> {
    const filteredList = mockTransactions.filter((item) => {
      let isMatch = true;

      if (filterForm.currency) {
        return item.currency === filterForm.currency;
      }

      return isMatch;
    });

    return Promise.resolve({
      totalItems: mockTransactions.length,
      items: filteredList.slice((page - 1) * size, page * size),
    });
  }

  function postPageChange(items: Transaction[]) {
    setSelectedTransactions([]);
    props.scrollToTop();
  }

  return (
    <div className="tFullList">
      <div className="tFullList__items">
        {currentData?.map((t, index) => (
          <TransactionFullListItem
            onSelect={onSelect}
            selected={selectedTransactions.includes(t)}
            transaction={t}
            key={index}
          />
        ))}
        {isEmpty ? (
          <div className="tFullList__empty"><Empty text="No transactions found" /></div>
        ) : null}
      </div>
      {maxPage > 0 && !isEmpty && (
        <div className="tFullList__pagination">
          <Pagination jump={jump} maxPage={maxPage} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
}
