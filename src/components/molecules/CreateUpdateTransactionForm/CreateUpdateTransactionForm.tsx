import classNames from "classnames";
import { Article, Bank, Bookmark } from "phosphor-react";
import { useState } from "react";

import { FormMode, Money, Transaction } from "@utils/Types";
import { Button, Input, Select, DatePicker } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { bankNamesPreset, categotyPreset } from "@utils/SelectItems";

export interface CreateUpdateTransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Transaction) => void;
}

export default function CreateUpdateTransactionForm(
  props: CreateUpdateTransactionFormProps
) {
  const classes = classNames("tForm", {});
  const formMode: FormMode = props.transaction ? "update" : "create";
  const [formState, setFormState] = useState<Transaction>(
    props.transaction || {
      amount: 0,
      category: "other",
      currency: "GBP",
      date: new Date(),
      description: "",
      source: "cash",
      active: true,
      inserted: new Date(),
    }
  );

  function inputChange(value: string | Money | Date, name: string) {
    if (name === "money") {
      const money = value as Money;
      setFormState({
        ...formState,
        amount: money.amount,
        currency: money.currency,
      });
    } else {
      setFormState({ ...formState, [name]: value });
    }
  }

  return (
    <div className={classes}>
      <div className="tForm__item">
        <Input
          icon={Article}
          name="description"
          onChange={inputChange}
          required
          title="Description"
          value={formState.description}
        />
      </div>
      <div className="tForm__item tForm__item--double">
        <CurrencyInput
          name="money"
          onChange={inputChange}
          required
          title="Amount"
          value={{
            amount: formState.amount,
            currency: formState.currency,
          }}
        />
        <Select
          name="category"
          items={categotyPreset}
          title="Category"
          value={formState.category}
          icon={Bookmark}
          required
          onChange={inputChange}
        />
      </div>
      <div className="tForm__item tForm__item--double">
        <Select
          name="source"
          items={bankNamesPreset}
          title="Source or bank"
          value={formState.source}
          icon={Bank}
          required
          onChange={inputChange}
        />
        <DatePicker
          required
          title="Date"
          name="date"
          onSelect={inputChange}
          value={formState.date}
        />
      </div>
      <div className="tForm__submit">
        <Button centerText type="primary">
          {formMode === "create" ? "Create transaction" : "Update transaction"}
        </Button>
      </div>
    </div>
  );
}
