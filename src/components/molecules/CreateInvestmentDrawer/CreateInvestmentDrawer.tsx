import { useState } from "react";
import { Button, Drawer, Input, Checkbox } from "@atoms/index";
import { CurrencyInput } from "@molecules/index";
import { Money } from "@utils/Types";
import { getDefaultMoney } from "@utils/Currency";

interface CreateInvestmentDrawerProps {
  open: boolean;
  onClose: (refreshData: boolean) => void;
}

export default function CreateInvestmentDrawer(props: CreateInvestmentDrawerProps) {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [money, setMoney] = useState<Money>(getDefaultMoney);
  const [moneyError, setMoneyError] = useState("");
  const [subtract, setSubtract] = useState(false);

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
        }),
      }).then(onClose);
    }
  }

  function onClose() {
    setTitle("");
    setTitleError("");
    setMoney(getDefaultMoney());
    setMoneyError("");
    setSubtract(false);
    props.onClose(true);
  }

  return (
    <Drawer destroyOnClose fullHeight onClose={onClose} open={props.open} title="Create investment" size="small">
      <div className="investmentDrawer">
        <div className="investmentDrawer__body">
          <Input error={titleError} title="Investment title" value={title} onChange={setTitle} />
          <CurrencyInput error={moneyError} title="Initial deposit" onlyPositive onChange={setMoney} value={money} />
          <Checkbox
            value={subtract ? "checked" : "unchecked"}
            onChange={setSubtract}
            title="Subtract deposit amount from cash balance"
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
