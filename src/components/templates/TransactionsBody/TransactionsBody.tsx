import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { FilePlus, TrashSimple, NoteBlank, FloppyDiskBack } from "phosphor-react";

import { Button, Drawer } from "@atoms/index";
import { TransactionFullList, TransactionSearchForm, CreateUpdateTransactionForm } from "@molecules/index";
import {
  addEditTransactionState,
  selectedTransactionsState,
  paginationLabelState,
  filterFormState,
  pagedTransactionsState,
} from "@recoil/transactions/atoms";
import { publish } from "@utils/Events";
import { Transaction } from "@utils/Types";

export default function TransactionsBody() {
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useRecoilState(selectedTransactionsState);
  const resetFilters = useResetRecoilState(filterFormState);
  const paginationLabel = useRecoilValue(paginationLabelState);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [transactionInEdit, setTransactionInEdit] = useRecoilState(addEditTransactionState);
  const resetTransactionInEdit = useResetRecoilState(addEditTransactionState);
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
    });
    setAddDrawerOpen(true);
  }

  function onAdd() {
    setAddDrawerOpen(true);
  }

  function onSubmitSave(transaction: Transaction) {
    const updateFn = !!transaction._id ? apiUpdate : apiCreate;

    setSaving(true);

    updateFn(transaction).then((success) => {
      if (success) {
        if (!transaction._id) {
          publish("mutateTransactions", selectedTransactions);
        } else {
          postUpdate(transaction);
        }
        setAddDrawerOpen(false);
      }
      setSaving(false);
    });
  }

  function postUpdate(transaction: Transaction) {
    const itemIdx = displayState.displayedItems.findIndex((t) => t._id === transaction._id)
          
    if (itemIdx > -1) {
      const newItems = [...displayState.displayedItems];

      newItems[itemIdx] = {
        ...transaction
      };

      setDisplayState({
        ...displayState,
        displayedItems: newItems,
      });
    }
  }

  async function apiCreate(transaction: Transaction): Promise<boolean> {
    const response = await fetch("/api/transactions/create", {
      method: "POST",
      body: JSON.stringify(transaction),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    
    if (data.message) {
      setSaveError(data.message);
    }
    
    return !!data._id;
  }

  async function apiUpdate(transaction: Transaction): Promise<boolean> {
    const response = await fetch("/api/transactions/update", {
      method: "PATCH",
      body: JSON.stringify({
        ...transaction,
        id: transaction._id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.message) {
      setSaveError(data.message);
    }

    return !!data._id;
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

  useEffect(() => {
    if (addDrawerOpen === false) {
      resetTransactionInEdit();
      setSaveError("");
    }
  }, [addDrawerOpen, resetTransactionInEdit]);

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
            <TransactionSearchForm showImportFilter />
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
      <Drawer
        open={addDrawerOpen}
        onClose={setAddDrawerOpen}
        title={transactionInEdit?._id ? "Edit transaction" : "Create transaction"}
        subtitle={transactionInEdit?._id ? `ID : ${transactionInEdit?._id}` : "All fields are required"}
        error={saveError}
        extra={
          <Button disabled={saving} type="primary" icon={FloppyDiskBack} onClick={() => onSubmitSave(transactionInEdit)}>
            {saving ? "Saving..." : "Save"}
          </Button>
        }
        destroyOnClose
      >
        <CreateUpdateTransactionForm atom={addEditTransactionState} />
      </Drawer>
    </div>
  );
}
