import { useState, useRef } from "react";
import classNames from "classnames";
import { Money, Currency } from "@utils/Types";
import { Input, InputProps, SelectMenu } from "@atoms/index";
import { currencyPreset } from "@utils/SelectItems";

type MyInputProps = Omit<
  InputProps,
  "value" | "onChange" | "setValue" | "onChangeEvent"
>;

export interface CurrencyInputProps extends MyInputProps {
  value: Required<Money>;
  onChange: (money: Money, name: string) => void;
  nonNegative?: boolean;
}

export default function CurrencyInput(props: CurrencyInputProps) {
  const { nonNegative, value, onChange, ...rest } = props;
  const thisRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [trailingComma, setTrailingComma] = useState(false);
  const classes = classNames("currencyInput", {
    "currencyInput--fixedWidth": props.fixedWidth,
  });

  function valueChange(v: string, name: string) {
    let endsWithComma = v.endsWith(".") || v.endsWith(",");

    if (endsWithComma) {
      v = v.slice(0, -1);
    }

    let parsed = parseFloat(v);

    if (v === "") {
      parsed = 0;
    }

    if (!isNaN(parsed) && (!nonNegative || parsed > 0)) {
      if (trailingComma !== endsWithComma) {
        setTrailingComma(endsWithComma);
      }

      onChange(
        {
          amount: parsed === 0 ? 0 : Math.floor(parsed * 100) / 100,
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
        value={value.amount.toString() + (trailingComma ? "." : "")}
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
