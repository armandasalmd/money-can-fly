import { useState } from "react";
import { useRouter } from "next/router";
import { Article, Bank, Bookmark } from "phosphor-react";
import { useRecoilValue } from "recoil";

import { Button, Card, CardHeaderAction, Input, Select } from "@atoms/index";
import {
  CurrencyInput
} from "@molecules/index";
import constants from "@utils/Constants";
import { getDefaultMoney } from "@utils/Currency";
import { bankNamesPreset, categotyPreset } from "@utils/SelectItems";
import { Category, DisplaySections, Money, Transaction, TransactionBank } from "@utils/Types";
import { publish } from "@utils/Events";
import { filterFormState, balanceChartDateRange } from "@recoil/dashboard/atoms";
import { useDashboardData } from "@hooks/index";

const DEFAULT_STATE: QuickAddFormState = {
  ...getDefaultMoney(false),
  bank: "cash",
  category: "other",
  description: "",
};

interface QuickAddFormState extends Money {
  bank: TransactionBank;
  category: Category;
  description: string;
}

export default function DashQuickAddCard() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [state, setState] = useState<QuickAddFormState>({
    ...DEFAULT_STATE
  });
  const filterForm = useRecoilValue(filterFormState);
  const balanceDateRange = useRecoilValue(balanceChartDateRange);
  const { mutate } = useDashboardData();

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

  function currencyInputChange(money: Money) {
    setState({ ...state, currency: money.currency, amount: money.amount });
  }

  function onSubmit() {
    const emptyFields: string[] = [];
    
    Object.entries(state).forEach(([key, value]) => {
      if (!value) {
        emptyFields.push(key);
      }
    });

    if (emptyFields.length > 0) {
      setError(`Please provide ${emptyFields.join(", ")}`);
      return;
    } else {
      setError("");
    }

    apiCreate({
      amount: state.amount,
      source: state.bank,
      category: state.category,
      currency: state.currency,
      description: state.description,
      date: new Date(),
      inserted: new Date(),
      isActive: true,
    }).then((success) => {
      if (success) {
        setState({ ...DEFAULT_STATE });

        publish("transactionSearchFormSubmit", filterForm);
        mutate([DisplaySections.BalanceAnalysis, DisplaySections.Insights], {
          balanceAnalysisDateRange: balanceDateRange,
        });
      }
    })
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
      setError(data.message);
    }
    
    return !!data._id;
  }

  return (
    <Card
      className="dashQuickAdd"
      closeError={() => setError("")}
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
            onlyPositive
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
    </Card>
  );
}
