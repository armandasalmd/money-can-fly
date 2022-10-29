import { useState } from "react";
import { Calendar, MagnifyingGlass } from "phosphor-react";

import { Button, Input, Select } from "@atoms/index";
import { Category, Currency } from "@utils/Types";
import { dateFromNow } from "@utils/Global";
import { categotyPreset, currencyPreset } from "@utils/SelectPresets";

export interface TransactionForm {
  category: Category;
  currency: Currency;
  dateFrom: Date;
  dateTo: Date;
  searchTerm: string;
}

export interface TransactionSearchFormProps {
  onSubmit: (state: TransactionForm) => void;
}

export default function TransactionSearchForm(props: TransactionSearchFormProps) {
  const [form, setForm] = useState<TransactionForm>({
    category: "other",
    currency: "GBP",
    dateFrom: dateFromNow(-30),
    dateTo: dateFromNow(0),
    searchTerm: "",
  });

  function onChange(event: any) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function onSelectChange(value: string, name: string) {
    setForm({ ...form, [name]: value });
  }

  return (
    <div className="tSearchForm">
      <div className="tSearchForm__inputs">
        <Input title="Date from" value={form.dateFrom.toDateString()} icon={Calendar} name="dateFrom" placeholder="Date from" onChange={onChange} />
        <Input title="Date to" value={form.dateTo.toDateString()} icon={Calendar} name="dateTo" placeholder="Date to" onChange={onChange} />
        <Select items={categotyPreset} title="Category" value={form.category} name="category" onChange={onSelectChange} />
        <Select items={currencyPreset} title="Currency" value={form.currency} name="currency" onChange={onSelectChange} />
        <Input className="tSearchForm__spanFull" title="Filter description" value={form.searchTerm} icon={MagnifyingGlass} name="searchTerm" onChange={onChange} />
      </div>
      <Button className="tSearchForm__button" centerText type="primary" onClick={() => props.onSubmit(form)}>
        Apply filters
      </Button>
    </div>
  );
}
