import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { FilePlus, TrashSimple, NoteBlank } from "phosphor-react";

import { Button } from "@atoms/index";
import { TransactionFullList, TransactionSearchForm, AddEditTransactionDrawer } from "@molecules/index";
import {
  addEditTransactionState,
  selectedTransactionsState,
  paginationLabelState,
  filterFormState,
  pagedTransactionsState,
} from "@recoil/transactions/atoms";
import { publish } from "@utils/Events";
import { Transaction, TransactionWithOptions } from "@utils/Types";
import constants from "@server/utils/Constants";

export default function TransactionsBody() {
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useRecoilState(selectedTransactionsState);
  const resetFilters = useResetRecoilState(filterFormState);
  const paginationLabel = useRecoilValue(paginationLabelState);
  const filterForm = useRecoilValue(filterFormState);

  const [_, setTransactionInEdit] = useRecoilState(addEditTransactionState);
  const [displayState, setDisplayState] = useRecoilState(pagedTransactionsState);

  function onDelete() {
    fetch("/api/transactions/deleteBulk", {
      method: "DELETE",
      body: JSON.stringify({
        ids: selectedTransactions.map((t) => t._id),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSelectedTransactions([]);
          publish("mutateTransactions", selectedTransactions);
        }
      });
  }

  function onEdit(transaction: Transaction) {
    setTransactionInEdit({
      ...transaction,
      date: new Date(transaction.date),
      dateUpdated: new Date(),
      amount: Math.abs(transaction.amount),
      alterBalance: true,
    });
    setAddDrawerOpen(true);
  }

  function onAdd() {
    setAddDrawerOpen(true);
  }

  function postSave(transaction: TransactionWithOptions, isAdd: boolean) {
    return isAdd ? publish("mutateTransactions", filterForm) : postUpdate(transaction);
  }

  function postUpdate(transaction: TransactionWithOptions) {
    const itemIdx = displayState.displayedItems.findIndex((t) => t._id === transaction._id);

    if (itemIdx > -1) {
      const newItems = [...displayState.displayedItems];

      newItems[itemIdx] = {
        ...transaction,
        amount: constants.negativeCategories.includes(transaction.category) ? -transaction.amount : transaction.amount,
      };

      setDisplayState({
        ...displayState,
        displayedItems: newItems,
      });
    }
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
          <div className="transactionsBody__headerActions">
            <Button icon={NoteBlank} type="text" onClick={resetFilters}>
              Clear
            </Button>
          </div>
        </div>
        <div>
          <div className="transactionsBody__filterForm">
            <TransactionSearchForm showSubmitButton showImportFilter />
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
            <Button type="primary" icon={FilePlus} onClick={onAdd}>
              Add
            </Button>
          </div>
        </div>
        <TransactionFullList
          onEdit={onEdit}
          scrollToTop={scrollListToTop}
          selectedTransactions={selectedTransactions}
          setSelectedTransactions={setSelectedTransactions}
        />
      </div>
      <AddEditTransactionDrawer open={addDrawerOpen} setOpen={setAddDrawerOpen} postSave={postSave} />
    </div>
  );
}
