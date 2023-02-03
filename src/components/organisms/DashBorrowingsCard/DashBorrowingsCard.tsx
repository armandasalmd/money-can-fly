import { useState } from "react";

import { Button, Card, Input } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { BorrowList } from "@components/molecules";
import { amountForDisplay, getDefaultMoney } from "@utils/Currency";
import { Borrowing, Money } from "@utils/Types";

const mockBorrows: Borrowing[] = [
  {
    id: "1",
    description: "Deividas taxi",
    money: {
      amount: 5.9,
      currency: "EUR",
    },
    date: "2021-01-01",
  },
  {
    id: "2",
    description: "Beer with friends",
    money: {
      amount: 15.5,
      currency: "GBP",
    },
    date: "2021-01-02",
  },
  {
    id: "3",
    description: "Tomas",
    money: {
      amount: 54,
      currency: "EUR",
    },
    date: "2021-01-02",
  },
];

export default function DashBorrowingsCard() {
  const [error, setError] = useState("");
  const [formState, setFormState] = useState<Borrowing>({
    money: getDefaultMoney(),
    description: "",
  });

  function inputChange(value: string | Money, name: string) {
    setFormState({ ...formState, [name]: value });
  }

  function onSubmit() {
    Object.values(formState).some((value) => !value)
      ? setError("All fields are required. Please fill them in.")
      : setError("");
  }

  const total = mockBorrows.reduce((acc, curr) => acc + curr.money.amount, 0); // Currency conversion is not implemented

  return (
    <Card
      noContentPaddingX
      noContentPaddingY
      className="dashBorrowings"
      error={error}
      header={{
        color: "warning",
        title: "Borrowings",
        description: `Total amount ${amountForDisplay({
          amount: total,
          currency: "GBP",
        } as any)}`,
      }}
      noDivider
    >
      <div className="dashBorrowings__form">
        <Input
          name="description"
          title="Description"
          value={formState.description}
          onChange={inputChange}
          onSubmit={onSubmit}
        />
        <CurrencyInput
          title="Amount"
          value={formState.money}
          name="money"
          onChange={inputChange}
        />
        <Button wrapContent onClick={onSubmit} type="primary">
          Add it
        </Button>
      </div>
      <div className="dashBorrowings__list">
        <BorrowList borrows={mockBorrows} />
      </div>
    </Card>
  );
}
