import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { FilePlus, TrashSimple } from "phosphor-react";
import { Button } from "@atoms/index";
import { TransactionFullList, TransactionSearchForm } from "@molecules/index";
import { selectedTransactionsState, paginationLabelState } from "@recoil/transactions/atoms";

export default function TransactionsBody() {
  const [selectedTransactions, setSelectedTransactions] = useRecoilState(selectedTransactionsState);
  const paginationLabel = useRecoilValue(paginationLabelState);

  function onDelete() {
    console.log("Delete selected transactions", selectedTransactions);
  }

  function scrollListToTop() {
    const list = document.querySelector(".transactionsBody__transactions");
    
  if (list) {
      list.scrollTo({ 
        behavior: "smooth",
        top: 0,  
      });
    }
  }

  const selectedCount = selectedTransactions?.length ?? 0;

  useEffect(() => {
    return () => {
      setSelectedTransactions([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="transactionsBody">
      <div className="transactionsBody__filters">
        <div className="transactionsBody__header">
          <div className="transactionsBody__headerTitle">
            <h2>Filters</h2>
            <p className="transactionsBody__Subtitle">Filter transactions</p>
          </div>
        </div>
        <div>
          <div className="transactionsBody__filterForm">
            <TransactionSearchForm />
          </div>
        </div>
      </div>
      <div className="transactionsBody__transactions">
        <div className="transactionsBody__header">
          <div className="transactionsBody__headerTitle">
            <h2>Transactions</h2>
            <p className="transactionsBody__Subtitle">{paginationLabel}</p>
          </div>
          <div className="transactionsBody__headerActions">
            {selectedCount > 0 && (
              <Button type="danger" icon={TrashSimple} onClick={onDelete}>
                {selectedCount + " selected"}
              </Button>
            )}
            <Button type="easy" icon={FilePlus}>
              Add
            </Button>
          </div>
        </div>
        <TransactionFullList
          scrollToTop={scrollListToTop}
          selectedTransactions={selectedTransactions}
          setSelectedTransactions={setSelectedTransactions}
        />
      </div>
    </div>
  );
}
