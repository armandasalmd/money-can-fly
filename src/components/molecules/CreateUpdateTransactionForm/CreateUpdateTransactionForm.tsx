import classNames from "classnames";
import { RecoilState, useRecoilState } from "recoil";
import { Article, Bank, Bookmark } from "phosphor-react";

import { Input, Select, DatePicker, Message } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { bankNamesPreset, categotyPreset } from "@utils/SelectItems";
import { FieldErrors, Money, Transaction } from "@utils/Types";

export interface CreateUpdateTransactionFormProps {
  atom: RecoilState<Transaction>;
  fieldErrors: FieldErrors<Transaction>;
}

export default function CreateUpdateTransactionForm(props: CreateUpdateTransactionFormProps) {
  const classes = classNames("tForm", {});
  const [formState, setFormState] = useRecoilState(props.atom);

  if (formState === null) {
    return null;
  }

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
      {!formState.isActive && (
        <Message className="tForm__header" colorType="info" messageStyle="bordered" counterMargin>
          Note. You are editing a disabled transaction
        </Message>
      )}

      <div className="tForm__item">
        <Input
          icon={Article}
          error={props.fieldErrors.description}
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
          onlyPositive
          error={props.fieldErrors.amount}
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
        <DatePicker required title="Execution date" name="date" onSelect={inputChange} value={formState.date} />
      </div>
    </div>
  );
}
