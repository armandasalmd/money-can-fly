import { useState, useRef } from "react";
import classNames from "classnames";
import { Money, Currency } from "@utils/Types";
import { Input, InputProps, SelectMenu } from "@atoms/index";
import { currencyPreset } from "@utils/SelectItems";
import { parseCurrency } from "@utils/Currency";

type MyInputProps = Omit<
  InputProps,
  "value" | "onChange" | "setValue" | "onChangeEvent"
>;

export interface CurrencyInputProps extends MyInputProps {
  value: Required<Money>;
  onChange: (money: Money, name: string) => void;
  onlyPositive?: boolean;
}

export default function CurrencyInput(props: CurrencyInputProps) {
  const { onlyPositive, value, onChange, ...rest } = props;
  const thisRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const classes = classNames("currencyInput", {
    "currencyInput--fixedWidth": props.fixedWidth,
  });

  function valueChange(v: string, name: string) {
    const amount = parseCurrency(v, onlyPositive);

    if (!isNaN(amount)) {
      setText(v);
      onChange(
        {
          amount,
          currency: value.currency,
        },
        name
      );
    }
  }

  function currencyChange(c: Currency) {
    onChange({ amount: value.amount, currency: c }, props.name);
    setOpen(false);
  }

  const inputDropdown = (
    <div className="currencyInput__dropdown" onClick={() => setOpen(!open)}>
      {value.currency}
    </div>
  );

  return (
    <div className={classes} ref={thisRef}>
      <Input
        {...rest}
        placeholder="0.00"
        value={text}
        onChange={valueChange}
        dropdownExtension={inputDropdown}
      />
      {open && (
        <SelectMenu
          baseRef={thisRef}
          close={setOpen}
          items={currencyPreset}
          onChange={currencyChange}
          selectedValue={value.currency}
        />
      )}
    </div>
  );
}