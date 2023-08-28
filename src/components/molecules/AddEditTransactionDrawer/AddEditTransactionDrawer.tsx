import { useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { FloppyDiskBack } from "phosphor-react";

import { Button, Drawer } from "@atoms/index";
import { addEditTransactionState } from "@recoil/transactions/atoms";
import { callIfFunction } from "@utils/Global";
import { FieldErrors, Transaction, TransactionWithOptions } from "@utils/Types";
import { CreateUpdateTransactionForm } from "@molecules/index";
import { patchRequest, postRequest } from "@utils/Api";

interface AddEditTransactionDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  postSave?: (transaction: TransactionWithOptions, isAdd: boolean) => void;
}

export default function Component(props: AddEditTransactionDrawerProps) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<Transaction>>({});
  const [saving, setSaving] = useState(false);
  const transactionInEdit = useRecoilValue(addEditTransactionState);
  const resetTransactionInEdit = useResetRecoilState(addEditTransactionState);

  function onSubmitSave(transaction: TransactionWithOptions) {
    const updateFn = !!transaction._id ? apiUpdate : apiCreate;

    setSaving(true);

    updateFn(transaction).then((success) => {
      if (success) {
        callIfFunction(props.postSave, transaction, !transaction._id);
        props.setOpen(false);
      }
      setSaving(false);
    });
  }

  async function apiCreate(transaction: TransactionWithOptions): Promise<boolean> {
    const response = await postRequest<any>("/api/transactions/create", transaction);

    if (response.fieldErrors) {
      setFieldErrors(response.fieldErrors);
    }

    return !!response._id;
  }

  async function apiUpdate(transaction: TransactionWithOptions): Promise<boolean> {
    const data = await patchRequest<any>("/api/transactions/update", {
      ...transaction,
      id: transaction._id,
    });

    if (data.fieldErrors) {
      setFieldErrors(data.fieldErrors);
    }

    return !!data._id;
  }

  useEffect(() => {
    if (props.open === false) {
      resetTransactionInEdit();
      setFieldErrors({});
    }
  }, [props.open, resetTransactionInEdit]);

  return (
    <Drawer
      open={props.open}
      onClose={() => props.setOpen(false)}
      title={transactionInEdit?._id ? "Edit transaction" : "Create transaction"}
      subtitle={transactionInEdit?._id ? `ID : ${transactionInEdit?._id}` : "All fields are required"}
      extra={
        <Button disabled={saving} type="primary" icon={FloppyDiskBack} onClick={() => onSubmitSave(transactionInEdit)}>
          {saving ? "Saving..." : "Save"}
        </Button>
      }
      destroyOnClose
    >
      <CreateUpdateTransactionForm atom={addEditTransactionState} fieldErrors={fieldErrors} />
    </Drawer>
  );
};
