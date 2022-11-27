import { useState } from "react";
import { useRouter } from "next/router";
import { Article, Bank, Bookmark } from "phosphor-react";

import { Button, Card, CardHeaderAction, Input, Select } from "@atoms/index";
import {
  CurrencyInput,
  TransactionList,
} from "@molecules/index";
import constants from "@utils/Constants";
import { bankNamesPreset, categotyPreset } from "@utils/SelectItems";
import { Category, Money, TransactionBank } from "@utils/Types";

const recentQuicAdds = [];

interface QuickAddFormState extends Money {
  bank: TransactionBank;
  category: Category;
  description: string;
}

export default function DashQuickAddCard() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [state, setState] = useState<QuickAddFormState>({
    amount: 0,
    bank: "cash",
    category: "other",
    currency: "GBP",
    description: "",
  });

  const headerActions: CardHeaderAction[] = [
    {
      type: "easy",
      text: "Edit transactions",
      onClick: () => router.push(constants.navbarLinks.transactions.path),
    },
  ];

  function inputChange(value: string, name: string) {
    setState({ ...state, [name]: value });
  }

  function currencyInputChange(money: Money, name: string) {
    setState({ ...state, currency: money.currency, amount: money.amount });
  }

  function onSubmit() {
    Object.values(state).some((value) => !value)
      ? setError("All fields are required. Please fill them in.")
      : setError("");
  }

  return (
    <Card
      className="dashQuickAdd"
      error={error}
      noContentPaddingX
      noContentPaddingY
      header={{
        color: "primary",
        title: "Quick add transaction",
      }}
      noDivider
      headerActions={headerActions}
    >
      <div className="dashQuickAdd__form">
        <div className="dashQuickAdd__rowOne">
          <Select
            items={categotyPreset}
            icon={Bookmark}
            name="category"
            title="Category"
            value={state.category}
            onChange={inputChange}
          />
          <Select
            items={bankNamesPreset}
            icon={Bank}
            name="bank"
            title="Source of money"
            value={state.bank}
            onChange={inputChange}
          />
          <CurrencyInput
            onChange={currencyInputChange}
            title="Amount"
            value={{
              amount: state.amount,
              currency: state.currency,
            }}
          />
        </div>
        <div className="dashQuickAdd__rowTwo">
          <Input
            title="Description"
            name="description"
            value={state.description}
            onChange={inputChange}
            icon={Article}
            onSubmit={onSubmit}
          />
          <Button onClick={onSubmit} type="primary" wrapContent>
            Add transaction
          </Button>
        </div>
      </div>
      <p className="dashQuickAdd__label">Recent quick adds</p>
      <div className="dashQuickAdd__list">
        <TransactionList transactions={recentQuicAdds} />
      </div>
    </Card>
  );
}
