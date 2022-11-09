import { Transaction } from "@utils/Types";
import TransactionFullListItem from "./TransactionFullListItem";
import { mockTransactions } from "@components/molecules";
import { Pagination } from "@molecules/index";
import { usePagination } from "@hooks/index";

export interface PredictionPreviewListProps {}

export default function TransactionFullList(props: PredictionPreviewListProps) {
  const { currentData, maxPage, jump } = usePagination<Transaction>(
    mockTransactions,
    20
  );

  return (
    <div className="tFullList">
      <div className="tFullList__filters">Filters section</div>
      <div className="tFullList__items">
        {currentData()?.map((t) => (
          <TransactionFullListItem {...t} />
        ))}
      </div>
      {maxPage > 1 && (
        <div className="tFullList__pagination">
          <Pagination pageCount={maxPage} onChange={jump} />
        </div>
      )}
    </div>
  );
}
