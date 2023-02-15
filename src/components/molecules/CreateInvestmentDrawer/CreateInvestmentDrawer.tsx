import { useState } from "react";
import { Button, Drawer, Input, Checkbox, DatePicker } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { usePreferences } from "@context/index";
import { Currency, Money } from "@utils/Types";

function defaultMoney(currency: Currency): Money {
  return {
    amount: 0,
    currency,
  };
}

interface CreateInvestmentDrawerProps {
  open: boolean;
  onClose: (refreshData: boolean) => void;
}

export default function CreateInvestmentDrawer(props: CreateInvestmentDrawerProps) {
  const { defaultCurrency } = usePreferences();
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [money, setMoney] = useState(defaultMoney(defaultCurrency));
  const [moneyError, setMoneyError] = useState("");
  const [date, setDate] = useState(new Date());
  const [dateError, setDateError] = useState("");
  const [subtract, setSubtract] = useState(true);

  function submit() {
    let valid = true;

    if (title === "") {
      setTitleError("Please enter a title");
      valid = false;
    } else {
      setTitleError("");
    }

    if (money.amount <= 0) {
      setMoneyError("Please enter a valid amount");
      valid = false;
    } else {
      setMoneyError("");
    }

    if (!date || date > new Date()) {
      setDateError("Date in the future is not allowed");
      valid = false;
    } else {
      setDateError("");
    }

    if (valid) {
      fetch("/api/investments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          initialDeposit: money,
          subtractFromBalance: subtract,
          startDate: date
        }),
      }).then(onClose);
    }
  }

  function onClose() {
    setTitle("");
    setTitleError("");
    setMoney(defaultMoney(defaultCurrency));
    setMoneyError("");
    setSubtract(true);
    setDate(new Date());
    setDateError("");
    props.onClose(true);
  }

  return (
    <Drawer destroyOnClose onClose={onClose} open={props.open} title="Create investment" size="small">
      <div className="investmentDrawer">
        <div className="investmentDrawer__body">
          <Input error={titleError} required title="Investment title" value={title} onChange={setTitle} />
          <CurrencyInput error={moneyError} required title="Initial deposit" onlyPositive onChange={setMoney} value={money} />
          <DatePicker onSelect={setDate} value={date} error={dateError} title="Investment date" required name="startDate" />
          <Checkbox
            value={subtract ? "checked" : "unchecked"}
            onChange={setSubtract}
            title="Link to a new transaction"
            horizontal
          />
        </div>
        <Button centerText type="primary" onClick={submit}>
          Submit
        </Button>
      </div>
    </Drawer>
  );
}
