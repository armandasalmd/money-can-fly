import classNames from "classnames";

export interface CurrencyInputProps {}

export default function CurrencyInput(props: CurrencyInputProps) {
  const classes = classNames("currencyInput", {});

  return <div className={classes}>CurrencyInput</div>;
}
