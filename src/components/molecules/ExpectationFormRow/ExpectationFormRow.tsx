import { Input } from "@atoms/index";
import { parseCurrency } from "@utils/Currency";
import { WeekPrediction } from "@utils/Types";
import { getWeekLabelAsDayRange } from "@utils/Date";
import { useState } from "react";

interface ExpectationFormRowProps {
  showTitle?: boolean;
  week: WeekPrediction;
  lastDayOfMonth?: number;
  onChange: (week: WeekPrediction) => void;
}

export default function ExpectationFormRow(props: ExpectationFormRowProps) {
  const [appendInComma, setAppendInComma] = useState(false);
  const [appendOutComma, setAppendOutComma] = useState(false);

  function noteChange(text: string) {
    props.onChange({ ...props.week, note: text });
  }

  function inputChange(value: string, name: string) {
    let num = parseCurrency(value, true);

    if (!isNaN(num)) {
      props.onChange({ ...props.week, [name]: num });

      if (name === "moneyIn") {
        setAppendInComma(value.endsWith("."));
      } else {
        setAppendOutComma(value.endsWith("."));
      }
    }
  }

  return (
    <div className="expectationFormRow">
      <div className="expectationFormRow__label">{getWeekLabelAsDayRange(props.week.week, props.lastDayOfMonth ?? 31) || "Total"}</div>
      <Input
        disabled={props.week.week === -1}
        placeholder="0.00"
        name="moneyIn"
        onChange={inputChange}
        value={props.week.moneyIn ? props.week.moneyIn.toString() + (appendInComma ? "." : "") : ""}
        title={props.showTitle ? "Money in" : ""}
      />
      <Input
        disabled={props.week.week === -1}
        placeholder="0.00"
        name="moneyOut"
        onChange={inputChange}
        value={props.week.moneyOut ? props.week.moneyOut.toString() + (appendOutComma ? "." : "") : ""}
        title={props.showTitle ? "Money out" : ""}
      />
      {props.week.week > 0 && <Input title={props.showTitle ? "Spending note" : ""} onChange={noteChange} value={props.week.note} />}
    </div>
  );
}
